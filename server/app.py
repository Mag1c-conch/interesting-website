import os
import sys
import json
import time
from typing import Generator
from flask import Flask, request, Response, jsonify, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv

# 确保在 Windows 控制台下输出 UTF-8 字符不会报错
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# 加载当前目录下的 .env
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)
# 允许跨域请求
CORS(app, resources={r"/api/*": {"origins": "*"}})

# 深圳航空专属 System Prompt
SHENZHEN_AIRLINES_SYSTEM_PROMPT = """你叫“深航 AI 飞行助手”，是深圳航空（Shenzhen Airlines）专为全员数字化业务实训打造的专业智能伴学导师。

你的核心定位与人设：
1. 服务于深圳航空各部门员工与学员（涵盖客舱乘务、飞行运行、地面服务、机务维修、空防安保、货运物流等岗位）。
2. 始终践行深圳航空“敢为人先、追求卓越”的企业精神和“任何时候、自然体贴”的深航服务理念。
3. 严格遵循中国民航 CCAR 体系安全标准与深圳航空九大职业安全红线，严守运行规程与旅客生命财产安全底线。

回答规范（必须严格遵守）：
1. 直奔主题，禁止使用任何问候、寒暄、自我介绍或称呼（绝对严禁在开头出现“李明杰同事您好”、“您好”、“收到”、“李明杰您好”等任何客套话），第一句话必须直接输出问题的核心答案。
2. 回答要严谨专业、条理清晰、层次分明，适当时使用清晰的标题与序号列表。
3. 结合民航实战场景（如客舱广播口令、应急撤离动作要领、防颠簸处置、餐食服务动线等）。
4. 语气专业客观、条理清晰。
5. 如果提问属于具体规程手册，可提示查阅《深圳航空乘务员标准操作程序手册(SOP)》、《民航安全通用法规》、《深圳航空服务礼仪指南》等受控规章。"""

# 内置智能民航规章库（未配置 Key 时的流畅高质量兜底）
BUILTIN_KNOWLEDGE = {
    "撤离": """【深圳航空客舱紧急撤离标准操作程序 (CCAR-121 SOP)】

1. 指令识别与初始响应：
   • 听到驾驶舱机长广播口令：“撤离！撤离！(Evacuate! Evacuate!)”后，乘务组立即执行撤离程序。
   • 乘务员就近按压客舱紧急照明开关，快速评估机外环境（确认无烟、无火、无障碍物）。

2. 舱门开启与滑梯充气：
   • 双手紧握机身辅助把手，迅速拉起舱门控制手柄到底；
   • 确认滑梯自动充气膨胀；若未自动充气，立即用力拉动红色的手动充气充气绳手柄(Manual Inflation Handle)。

3. 标准疏散喊话口令（简短、连续、高声）：
   • “解开安全带！(Release seatbelts!)”
   • “丢下所有行李！脱掉高跟鞋！(Leave everything! High-heels off!)”
   • “往这边跑！跳！滑！(Come this way! Jump and slide!)”

4. 机组最后清舱检查：
   • 待旅客疏散完毕后，乘务长与带班乘务员快速巡视客舱、洗手间、机组休息区；
   • 携带便携式应急定位发射机(ELT)、急救箱及手电筒最后离机。

📖 参考规章依据：《客舱乘务员标准操作程序手册 (SOP 2024版)》第七章·应急处置。""",

    "礼仪": """【深圳航空“自然体贴”乘务服务礼仪与问候标准】

1. 登机迎客礼仪：
   • 站姿标准：丁字步或平步站立，双手自然交叠于腹前（右手在上），面带微笑；
   • 问候手势与体态：上身自然前倾 15°，目光温和注视旅客；
   • 标准问候语：“女士/先生，您好！欢迎乘坐深圳航空，请出示您的登机牌。”

2. 餐饮服务规范：
   • 双人推车动线：推车前行时严禁单人越过安全防滑限位，注意避让旅客脚步；
   • 热饮递送细节：纸杯热饮装杯容积严格控制在 70% 刻度以内，必须加盖杯盖或使用托盘递送；
   • 递送温馨提醒：“您好，请小心烫，祝您用餐愉快。”

3. 特殊旅客关怀：
   • 针对无人陪伴儿童、长者、轮椅旅客，实行“专人交接、主动问候、落地送机”的全程贴心守护。

📖 参考规章依据：《深圳航空服务标准与跨文化沟通手册》第二章·客舱仪态。""",

    "急救": """【机上突发突发伤病初级医疗急救处置流程】

1. 现场初步评估 (DRABC 原则)：
   • D(危险评估)：确认客舱环境安全，排除颠簸、烟雾、危险品威胁；
   • R(意识反应)：轻拍旅客双肩，在双耳旁大声呼唤：“您怎么了？能听见我说话吗？”；
   • A/B(气道与呼吸)：仰头抬颏开放气道，观察胸部起伏 5~10 秒。

2. 团队呼救与广播寻医：
   • 立即向乘务长报告，乘务长联络机长评估航路就近备降可能；
   • 启动机上医疗广播，寻找具备执业医师资格的医护旅客协助。

3. AED 与应急医疗箱取用：
   • 确认心搏骤停（无反应且无正常呼吸），立即就近取用机载自动体外除颤仪(AED)与卫生防疫包；
   • 实施持续心肺复苏 (CPR)，胸外按压与人工呼吸比例 30:2，按压深度 5-6cm，频率 100-120 次/分。

📖 参考规章依据：《突发公共安全事件全员应急避险与初级急救常识》手册。""",

    "计划": """【深圳航空新学员数字化实训建议周计划】

结合数字化平台实训大纲，为您推荐高效进阶学习路线：
• 周一（安全红线日）：通读《民用航空安全通用法规与九大职业红线》，完成在线必修自测（+80积分）；
• 周二（技能攻坚日）：佩戴 VR 头显或在浏览器中完成《客舱紧急撤离演练》实操训练（+150积分）；
• 周三（服务进阶日）：研读《深圳航空企业文化与服务礼仪规范》，完成 30 分钟机舱巡视模拟；
• 周四（专业深读日）：查阅专业知识库中对口部门受控规章（飞行/地服/机务专业文档）；
• 周五（复盘测评日）：参与本周章节测验与综合模拟考试，冲刺全员排行榜前三甲！

💡 提示：每天坚持在主页完成“每日签到”可连续累加积分哦！"""
}

def get_fallback_response(user_query: str) -> str:
    """根据问题意图匹配内置专业民航知识库"""
    for key, text in BUILTIN_KNOWLEDGE.items():
        if key in user_query:
            return text
            
    # 通用回复
    return f"""您好！已收到您关于“{user_query}”的咨询。

根据深圳航空受控规章与中国民航安全规程要求：
1. 规范执行：所有民航运行岗位均需严格执行标准操作程序（SOP），坚持安全第一不动摇。
2. 协同作业：坚持闭环沟通（Readback-Hearback），遇到异常情况按规定层级快速报告。
3. 学习指引：您可以查阅左侧导航栏的【航空知识库】获取最新发布的受控红头文件与操作手册。

（提示：当前运行于深航民航实训智能伴学引擎，为您提供全流程规范答疑与业务知识辅助。）"""

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({
        "status": "ok",
        "service": "Shenzhen Airlines AI Assistant Backend",
        "timestamp": int(time.time())
    })

@app.route('/api/model/status', methods=['GET'])
def model_status():
    """获取当前大模型配置状态"""
    server_key = os.getenv('DASHSCOPE_API_KEY', '').strip()
    model_name = os.getenv('MODEL_NAME', 'qwen-plus')
    base_url = os.getenv('OPENAI_BASE_URL', 'https://dashscope.aliyuncs.com/compatible-mode/v1')
    
    return jsonify({
        "hasKey": bool(server_key),
        "model": model_name,
        "baseUrl": base_url,
        "provider": "Aliyun DashScope (通义千问 Qwen) / Compatible",
        "freeInfo": "阿里云百炼新注册账号免费赠送百万 Token 免费额度"
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    AI 聊天流式接口 (Server-Sent Events)
    请求体:
    {
      "messages": [{"role": "user", "content": "..."}],
      "apiKey": "可选，前端用户自定义 API Key",
      "model": "可选，模型名称，默认 qwen-plus",
      "baseUrl": "可选，兼容地址"
    }
    """
    data = request.get_json(silent=True) or {}
    messages = data.get('messages', [])
    user_api_key = data.get('apiKey', '').strip()
    req_model = data.get('model', '').strip()
    req_base_url = data.get('baseUrl', '').strip()

    # 优先使用前端传入的 key，其次使用服务端 .env 中的 key
    api_key = user_api_key or os.getenv('DASHSCOPE_API_KEY', '').strip()
    model_name = req_model or os.getenv('MODEL_NAME', 'qwen-plus')
    base_url = req_base_url or os.getenv('OPENAI_BASE_URL', 'https://dashscope.aliyuncs.com/compatible-mode/v1')

    # 获取最新用户提问
    latest_user_query = ""
    for m in reversed(messages):
        if m.get('role') == 'user':
            latest_user_query = m.get('content', '')
            break

    def stream_generator() -> Generator[str, None, None]:
        # 情况一：已配置 API Key，调用真实千问大模型流式接口
        if api_key:
            try:
                from openai import OpenAI
                client = OpenAI(
                    api_key=api_key,
                    base_url=base_url
                )

                # 构造消息列表，首位注入深航专属 System Prompt
                full_messages = [{"role": "system", "content": SHENZHEN_AIRLINES_SYSTEM_PROMPT}]
                for m in messages:
                    if m.get('role') in ['user', 'assistant']:
                        full_messages.append({
                            "role": m.get('role'),
                            "content": m.get('content')
                        })

                # 是否开启深度思考配置 (默认 false 关闭深度思考，跳过漫长思考推理直接极速回复)
                enable_thinking = os.getenv('ENABLE_THINKING', 'false').strip().lower() in ['true', '1', 'yes']
                call_kwargs = {
                    "model": model_name,
                    "messages": full_messages,
                    "stream": True,
                    "temperature": 0.7,
                    "max_tokens": 1500
                }
                if not enable_thinking:
                    call_kwargs["extra_body"] = {"enable_thinking": False}

                # 发起流式调用
                stream_response = client.chat.completions.create(**call_kwargs)

                for chunk in stream_response:
                    if chunk.choices and len(chunk.choices) > 0:
                        delta = chunk.choices[0].delta
                        if hasattr(delta, 'content') and delta.content:
                            payload = json.dumps({"content": delta.content}, ensure_ascii=False)
                            yield f"data: {payload}\n\n"

                # 结束标志
                yield "data: [DONE]\n\n"
                return

            except Exception as e:
                err_msg = str(e)
                print(f"[Qwen API Error]: {err_msg}")
                # 告知前端出错详情，并降级至深航知识库兜底，保证用户不中断体验
                error_msg = f"【提示: 大模型API连接受限 ({err_msg})，已为您自动切换至深航规章知识库解答】\n\n"
                payload = json.dumps({"content": error_msg}, ensure_ascii=False)
                yield f"data: {payload}\n\n"
                
        # 情况二：未配置 API Key 或 API 异常时，启用高拟真流式民航知识引擎
        time.sleep(0.1) # 微微拟真思考延迟
        simulated_answer = get_fallback_response(latest_user_query)
        
        # 逐段/逐字模拟打字机流式输出
        chunk_size = 3
        for i in range(0, len(simulated_answer), chunk_size):
            chunk = simulated_answer[i:i + chunk_size]
            payload = json.dumps({"content": chunk}, ensure_ascii=False)
            yield f"data: {payload}\n\n"
            time.sleep(0.02) # 20ms 流畅打字速度

        yield "data: [DONE]\n\n"

    return Response(
        stream_with_context(stream_generator()),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        }
    )

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    print("=" * 60)
    print(">> Shenzhen Airlines AI Assistant Python Backend Starting...")
    print(f">> Listen URL: http://127.0.0.1:{port}")
    print(f">> Model: {os.getenv('MODEL_NAME', 'qwen-plus')}")
    print(">> SSE Endpoint: POST /api/chat")
    print(">> Status Endpoint: GET /api/model/status")
    print("=" * 60)
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
