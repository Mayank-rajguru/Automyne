from fastapi import APIRouter, WebSocket
import asyncio
import random
from datetime import datetime

router = APIRouter()

clients = []


@router.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    clients.append(websocket)

    try:
        while True:
            # Simulated realtime event
            payload = {
                "type": "market_update",
                "timestamp": datetime.utcnow().isoformat(),

                "sentiment_shift": round(
                    random.uniform(-1, 1), 2
                ),

                "signal_strength": random.randint(
                    40,
                    95,
                ),

                "event": random.choice([
                    "Bullish momentum increasing",
                    "Bearish pressure detected",
                    "Sentiment spike detected",
                    "Retail activity rising",
                    "Momentum stabilizing",
                ]),
            }

            await websocket.send_json(payload)

            await asyncio.sleep(4)

    except Exception:
        pass

    finally:
        if websocket in clients:
            clients.remove(websocket)