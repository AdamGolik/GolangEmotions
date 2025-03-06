# Dziennik Emocji i Zdjęć - Aplikacja Fullstack

## 📝 Spis Treści
- [Opis Projektu](#opis-projektu)
- [Funkcjonalności](#funkcjonalności)
- [Technologie](#technologie)
- [Struktura Projektu](#struktura-projektu)
- [Instalacja](#instalacja)
- [Konfiguracja](#konfiguracja)
- [Uruchomienie](#uruchomienie)
- [API Endpoints](#api-endpoints)
- [Dokumentacja API](#dokumentacja-api)

## 🎯 Opis Projektu
Aplikacja służy do śledzenia emocji i zarządzania zdjęciami użytkowników. Pozwala na monitorowanie samopoczucia, aktywności fizycznej oraz umożliwia dzielenie się zdjęciami z innymi użytkownikami.

## ⚡ Funkcjonalności
- 👤 System autentykacji użytkowników (rejestracja/logowanie)
- 📊 Śledzenie emocji i samopoczucia
- 📸 Zarządzanie zdjęciami (dodawanie/usuwanie/edycja)
- 🔄 Responsywny interfejs użytkownika
- 🔒 Prywatne i publiczne udostępnianie treści
- 📱 Wsparcie dla urządzeń mobilnych

## 🛠 Technologie
### Backend
- Go 1.23.3
- Gin Framework
- GORM
- JWT dla autoryzacji
- SQLite/PostgreSQL

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Responsive Design
- Modern UI/UX principles

## 📁 Struktura Projektu
project/ ├── backend/ │ ├── auth/ │ ├── controller/ │ ├── initializers/ │ ├── model/ │ └── main.go ├── frontend/ │ ├── index.html │ ├── styles.css │ └── app.js └── uploads/ └── pictures/

## 🚀 Instalacja

### Wymagania
- Go 1.23.3 lub nowszy
- Node.js (opcjonalnie, dla narzędzi deweloperskich)
- Git

### Kroki instalacji

1. Klonowanie repozytorium:
```bash
git clone [adres-repozytorium]
cd [nazwa-projektu]
```

2. Instalacja zależności Go:
```bash
go mod tidy
```

3. Konfiguracja zmiennych środowiskowych:
Utwórz plik `.env` w głównym katalogu projektu:
```env
DB_URL="[twój-connection-string]"
JWT_SECRET="[twój-sekretny-klucz]"
PORT=8080
```

## ⚙️ Konfiguracja

### Backend
1. Upewnij się, że masz skonfigurowaną bazę danych
2. Sprawdź uprawnienia do folderu `uploads/pictures`
3. Skonfiguruj CORS w pliku `main.go` jeśli potrzebne

### Frontend
1. Sprawdź czy `API_URL` w `app.js` wskazuje na prawidłowy adres backendu
2. Dostosuj ścieżki w `index.html` jeśli potrzebne

## 🌟 Uruchomienie

### Backend
```bash
go run main.go
```

### Frontend
Otwórz `index.html` w przeglądarce lub użyj lokalnego serwera HTTP:
```bash
# Używając Python
python -m http.server 3000
```

## 🔌 API Endpoints

### Autoryzacja
- `POST /register` - Rejestracja nowego użytkownika
- `POST /login` - Logowanie użytkownika

### Konto użytkownika
- `PUT /account/update` - Aktualizacja danych konta
- `GET /account/See` - Pobranie danych konta
- `DELETE /account/delete` - Usunięcie konta

### Emocje
- `POST /emotions/add` - Dodanie nowego wpisu
- `GET /emotions/my` - Pobranie własnych wpisów
- `PUT /emotions/update/:id` - Aktualizacja wpisu
- `DELETE /emotions/delete/:id` - Usunięcie wpisu
- `GET /emotions/analysis` - Analiza emocji

### Zdjęcia
- `GET /all` - Pobranie wszystkich publicznych zdjęć
- `GET /img/my` - Pobranie własnych zdjęć
- `POST /img/add` - Dodanie nowego zdjęcia
- `PUT /img/update/:id` - Aktualizacja zdjęcia
- `DELETE /img/delete/:id` - Usunięcie zdjęcia

## 🔒 Bezpieczeństwo
- Wszystkie endpointy (oprócz /login i /register) wymagają tokenu JWT
- Hasła są hashowane przed zapisem do bazy danych
- Implementacja CORS dla bezpieczeństwa cross-origin
- Walidacja plików przy uploadzie zdjęć

## 📝 Uwagi
- Aplikacja wymaga połączenia z internetem
- Zalecane jest używanie najnowszych wersji przeglądarek
- Backend musi być uruchomiony przed rozpoczęciem korzystania z frontendu

## 🤝 Wkład w projekt
1. Fork repozytorium
2. Stwórz nową gałąź (`git checkout -b feature/AmazingFeature`)
3. Commit zmiany (`git commit -m 'Add some AmazingFeature'`)
4. Push do gałęzi (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📫 Kontakt
[Twoje dane kontaktowe]

## 📄 Licencja
Ten projekt jest licencjonowany pod [wybrana licencja]
