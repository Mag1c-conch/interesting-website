import { useState, useRef, useEffect } from 'react'
import { marked } from 'marked'

// 配置 marked 为 GitHub Flavored Markdown 规范
marked.setOptions({
  gfm: true,
  breaks: true,
})

function formatMarkdown(content: string): string {
  if (!content) return ''
  try {
    return marked.parse(content) as string
  } catch {
    return content
  }
}

export interface ChatMsg {
  role: 'user' | 'ai'
  text: string
  time: string
  refDoc?: string
  isStreaming?: boolean
}

interface AIAssistantProps {
  onOpenDoc?: (docTitle: string) => void
}

const PROMPT_PILLS = [
  { label: '客舱紧急撤离程序要点', prompt: '请详细阐述深圳航空客舱紧急撤离的标准操作程序（SOP）和各阶段核心职责。' },
  { label: '乘务员服务礼仪与问候标准', prompt: '请介绍深圳航空乘务员在迎客、登机、安检以及巡舱时的标准礼仪和微笑问候语规范。' },
  { label: '民航安全九大红线禁令', prompt: '请列举并解读中国民用航空安全领域的“九大职业红线”与严禁违反的合规底线。' },
  { label: '机上突发急救 DRABC SOP', prompt: '旅客在万米高空突发休克晕厥时，乘务员应如何执行 DRABC 急救评估与 AED 使用流程？' },
  { label: '晴空颠簸处置标准', prompt: '在遭遇突发严重晴空颠簸（CAT）时，机组与乘务组的即时处置动作及旅客安抚标准是什么？' }
]

export default function AIAssistant({ onOpenDoc }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'ai',
      text: '您好！我是深圳航空专属 AI 飞行伴学助手。\n\n您可以随时向我咨询《深圳航空服务标准手册》、客舱紧急撤离 SOP、民航安全九大职业红线禁令、机上医疗急救流程，或进行专业实操问答。',
      time: '刚刚'
    }
  ])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [abortCtrl, setAbortCtrl] = useState<AbortController | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  // 后端服务运行与模型状态
  const [serverConnected, setServerConnected] = useState(false)
  const [hasServerKey, setHasServerKey] = useState(false)
  const [serverModel, setServerModel] = useState('qwen-plus')

  const chatEndRef = useRef<HTMLDivElement>(null)

  // 探测后端服务状态
  const checkServerStatus = () => {
    fetch('/api/model/status')
      .then(res => res.json())
      .then(data => {
        setServerConnected(true)
        setHasServerKey(Boolean(data.hasKey))
        if (data.model) setServerModel(data.model)
      })
      .catch(() => {
        setServerConnected(false)
      })
  }

  useEffect(() => {
    checkServerStatus()
    const timer = setInterval(checkServerStatus, 15000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // 真实 SSE 流式输出交互
  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || query).trim()
    if (!q || loading) return

    const now = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    const newMessages: ChatMsg[] = [
      ...messages,
      { role: 'user', text: q, time: now },
      { role: 'ai', text: '', time: now, isStreaming: true }
    ]

    setMessages(newMessages)
    if (!textToSend) setQuery('')
    setLoading(true)

    const controller = new AbortController()
    setAbortCtrl(controller)

    try {
      // 构造给后端的对话上下文（过滤首条静态欢迎语，杜绝大模型在上下文里模仿姓名称呼）
      const apiMessages = newMessages
        .slice(0, -1)
        .filter((_, idx) => idx > 0)
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          apiKey: undefined,
          model: serverModel,
          baseUrl: undefined
        }),
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`后端返回异常 HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder('utf-8')
      let aiFullResponse = ''

      if (reader) {
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || !trimmed.startsWith('data:')) continue

            const jsonStr = trimmed.replace(/^data:\s*/, '')
            if (jsonStr === '[DONE]') continue

            try {
              const parsed = JSON.parse(jsonStr)
              if (parsed.error) {
                aiFullResponse += `\n[错误: ${parsed.error}]`
              } else if (parsed.content) {
                aiFullResponse += parsed.content
              }

              // 实时更新当前正在流式输出的最后一条 AI 消息
              setMessages(prev => {
                const next = [...prev]
                const lastIdx = next.length - 1
                if (lastIdx >= 0 && next[lastIdx].role === 'ai') {
                  next[lastIdx] = {
                    ...next[lastIdx],
                    text: aiFullResponse,
                    isStreaming: true
                  }
                }
                return next
              })
            } catch {
              // 忽略单帧 JSON 解析容错
            }
          }
        }
      }

      // 流式输出完毕，移除光标闪烁
      setMessages(prev => {
        const next = [...prev]
        const lastIdx = next.length - 1
        if (lastIdx >= 0 && next[lastIdx].role === 'ai') {
          next[lastIdx] = {
            ...next[lastIdx],
            text: aiFullResponse || '抱歉，未能获取到有效回复。请检查后端网络与配置。',
            isStreaming: false
          }
        }
        return next
      })

    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') {
        setMessages(prev => {
          const next = [...prev]
          const lastIdx = next.length - 1
          if (lastIdx >= 0 && next[lastIdx].role === 'ai') {
            next[lastIdx] = {
              ...next[lastIdx],
              text: (next[lastIdx].text || '') + '\n\n*(已手动停止生成)*',
              isStreaming: false
            }
          }
          return next
        })
      } else {
        const errMsg = (err as Error).message || '网络连接失败'
        setMessages(prev => {
          const next = [...prev]
          const lastIdx = next.length - 1
          if (lastIdx >= 0 && next[lastIdx].role === 'ai') {
            next[lastIdx] = {
              ...next[lastIdx],
              text: `⚠️ 连接异常: ${errMsg}。\n\n请确认 Python 后端服务正常运行。`,
              isStreaming: false
            }
          }
          return next
        })
      }
    } finally {
      setLoading(false)
      setAbortCtrl(null)
    }
  }

  const handleStop = () => {
    if (abortCtrl) {
      abortCtrl.abort()
    }
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1800)
  }

  const handleClearChat = () => {
    if (confirm('确认清空当前所有对话记录吗？')) {
      setMessages([
        {
          role: 'ai',
          text: '对话记录已清空。您可以随时向我提问关于深航规章、SOP 标准流程与安全培训的任何问题。',
          time: '刚刚'
        }
      ])
    }
  }

  const activeModelDisplay = serverConnected
    ? (hasServerKey ? `${serverModel}` : '通义千问 · 伴学导师')
    : '后端连接中...'

  return (
    <div className="flex flex-col h-full p-8 lg:p-10 max-w-4xl mx-auto relative select-text">
      {/* 顶部状态与功能栏 */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E60026] text-white flex items-center justify-center font-bold text-base shadow-sm">
            ✦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1E293B]">AI 飞行助手</h1>
              <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-medium ${serverConnected
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-[#E60026] border border-rose-200'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${serverConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span>{activeModelDisplay}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="清空当前所有聊天记录"
          >
            清空对话
          </button>
        </div>
      </div>

      {/* 聊天消息信息流 (流式渲染) */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-3.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${m.role === 'user' ? 'bg-[#E60026] text-white' : 'bg-[#0B192C] text-white'
              }`}>
              {m.role === 'user' ? '李' : 'AI'}
            </div>

            <div className={`max-w-[84%] rounded-2xl p-4 text-[13px] leading-relaxed relative group ${m.role === 'user'
              ? 'bg-[#E60026] text-white rounded-tr-xs shadow-xs'
              : 'bg-white border border-[#EEF0F4] text-[#1E293B] rounded-tl-xs shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
              }`}>
              {m.role === 'user' ? (
                <div className="whitespace-pre-line leading-relaxed">{m.text}</div>
              ) : (
                <div className="relative">
                  {m.text ? (
                    <div>
                      <div
                        className="markdown-content"
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(m.text) }}
                      />
                      {/* 流式打字机闪烁光标 */}
                      {m.isStreaming && (
                        <span className="inline-block w-1.5 h-4 ml-1 bg-[#E60026] animate-pulse align-middle" />
                      )}
                    </div>
                  ) : (
                    /* 思考中状态：不显示任何文字干扰，只显示极简的三点脉冲动画 */
                    <div className="flex items-center gap-1.5 py-1.5 px-0.5">
                      <span className="w-2 h-2 bg-[#E60026] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-[#E60026] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-[#E60026] rounded-full animate-bounce" />
                    </div>
                  )}
                </div>
              )}

              {/* 底部工具栏与推荐规章卡片 (有回复内容时呈现) */}
              {m.text && (
                <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>{m.time}</span>
                    {m.role === 'ai' && (
                      <span className="text-slate-400">· 深圳航空智能导师</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(m.text, idx)}
                      className="hover:text-slate-700 p-1 rounded transition-colors cursor-pointer"
                      title="复制回答"
                    >
                      {copiedIdx === idx ? '已复制 ✓' : '复制'}
                    </button>
                    {m.role === 'ai' && onOpenDoc && (
                      <button
                        onClick={() => onOpenDoc('doc-2')}
                        className="text-[#E60026] hover:underline p-1 cursor-pointer font-medium"
                      >
                        查阅标准规章 ➔
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* 快捷推荐问题胶囊 */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs">
          <span className="text-slate-400 shrink-0 text-[11px] font-medium">推荐提问:</span>
          {PROMPT_PILLS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.prompt)}
              disabled={loading}
              className="shrink-0 bg-white hover:bg-rose-50 hover:border-[#E60026]/50 border border-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap shadow-xs disabled:opacity-50"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 底部输入框与发送区 */}
      <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 focus-within:border-[#E60026] focus-within:ring-2 focus-within:ring-[#E60026]/10 p-2 shadow-sm transition-all">
        <textarea
          rows={1}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="向深航 AI 飞行导师提问任何规章、SOP 操作、应急处置或考核考点... (Enter 发送)"
          className="w-full resize-none border-none outline-none px-3 py-2 text-xs text-[#1E293B] placeholder-slate-400 max-h-32"
        />

        {loading ? (
          <button
            type="button"
            onClick={handleStop}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer shadow-xs shrink-0 flex items-center gap-1"
          >
            <span>■</span>
            <span>停止生成</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!query.trim()}
            className="bg-[#E60026] hover:bg-[#CC0022] disabled:opacity-40 text-white text-xs px-5 py-2 rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
          >
            发送
          </button>
        )}
      </div>
    </div>
  )
}
