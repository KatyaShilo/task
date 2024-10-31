FROM mcr.microsoft.com/playwright:v1.34.0-focal

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx playwright install

CMD ["npx", "playwright", "test"]
