FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
  git \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

RUN pip install --no-cache-dir \
  scikit-learn \
  pandas \
  numpy \
  matplotlib \
  seaborn \
  joblib \
  kaggle

RUN mkdir -p /workspace/models /workspace/outputs /workspace/datasets

RUN chmod -R 777 /workspace

ENV PYTHONPATH=/workspace
ENV PYTHONUNBUFFERED=1

WORKDIR /workspace