from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pathlib import Path
import pandas as pd
import numpy as np
from pipeline import run_pipeline
from ws import router as ws_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

app.include_router(ws_router)


class TickerRequest(BaseModel):
    ticker: str


@app.post("/run-pipeline")
def run_pipeline_api(payload: TickerRequest):

    ticker = payload.ticker.upper()

    try:
        # Run your existing pipeline
        run_pipeline(ticker)

        # Load latest generated files
        base = ticker.lower()

        merged_path = Path(f"output/{base}_merged.csv")
        weekly_path = Path(f"output/{base}_weekly_predictions.csv")
        summary_path = Path(f"output/{base}_summary.txt")

        if not merged_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Pipeline output not found"
            )

        merged_df = pd.read_csv(merged_path)

        latest = merged_df.iloc[-1].replace(
            [np.nan, np.inf, -np.inf],
            None
        ).to_dict()

        summary = ""

        if summary_path.exists():
            summary = summary_path.read_text(
                encoding="utf-8"
            )
        
        chart_data = merged_df.tail(30).replace(
            [np.nan, np.inf, -np.inf],
            None
        ).to_dict(orient="records")

        return {
            "ticker": ticker,
            "latest_signal": latest,
            "summary": summary,
            "chart_data": chart_data
        }
    except Exception as e:
        import traceback

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )   
    # except Exception as e:
    #     raise HTTPException(
    #         status_code=500,
    #         detail=str(e)
    #     )