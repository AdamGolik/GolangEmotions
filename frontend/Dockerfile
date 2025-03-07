# Etap budowania
FROM node:20-alpine AS builder

# Ustawienie katalogu roboczego
WORKDIR /app

# Kopiowanie plików package*.json
COPY package*.json ./

# Instalacja zależności
RUN npm install

# Kopiowanie reszty plików projektu
COPY . .

# Budowanie aplikacji
RUN npm run build

# Etap produkcyjny
FROM node:20-alpine AS runner

# Ustawienie katalogu roboczego
WORKDIR /app

# Ustawienie na środowisko produkcyjne
ENV NODE_ENV production

# Dodanie użytkownika dla bezpieczeństwa
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiowanie niezbędnych plików z etapu budowania
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ustawienie właściciela plików
RUN chown -R nextjs:nodejs /app

# Przełączenie na użytkownika nextjs
USER nextjs

# Ekspozycja portu
EXPOSE 3000

# Zmienna środowiskowa dla API URL
ENV NEXT_PUBLIC_API_URL=http://localhost:8080

# Komenda startowa
CMD ["node", "server.js"]
