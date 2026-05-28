FROM python:3.11-slim

WORKDIR /app

# 스레드 문제 해결
ENV PIP_PROGRESS_BAR=off
ENV PYTHONUNBUFFERED=1
ENV OPENBLAS_NUM_THREADS=1
ENV OMP_NUM_THREADS=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "config.wsgi", "--bind", "0.0.0.0:8000"]