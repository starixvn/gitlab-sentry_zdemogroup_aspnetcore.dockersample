FROM hub.nexdev.net/base/dotnet/core/sdk:8.0-alpine AS builder
WORKDIR /src

COPY *.sln .
COPY WebSite2/*.csproj ./WebSite2/
COPY CommonLibs/*.csproj ./CommonLibs/

RUN dotnet nuget add source https://nuget.nexdev.net/api/v2

RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore -v n ./WebSite2/WebSite2.csproj

COPY CommonLibs/. ./CommonLibs/
COPY WebSite2/. ./WebSite2/
WORKDIR /src/WebSite2

RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet publish -v m -r linux-x64 --self-contained false -o /app

FROM hub.nexdev.net/base/dotnet/core/aspnet:8.0-alpine AS base

# impersonate into the new user
RUN adduser --disabled-password \
    --home /app \
    --gecos '' dotnetuser && chown -R dotnetuser /app

USER dotnetuser
#
WORKDIR /app
COPY --from=builder /app .

ENV TZ="America/La_Paz"

ENTRYPOINT ["dotnet", "WebSite2.dll"]
