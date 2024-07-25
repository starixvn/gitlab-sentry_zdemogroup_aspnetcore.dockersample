FROM hub.nexdev.net/base/dotnet/core/sdk:5.0.102-ca-patch-buster-slim AS builder

ENV NUGET_PACKAGES=/src/packages

WORKDIR /src

COPY *.sln .
COPY WebSite1/*.csproj ./WebSite1/

RUN dotnet nuget add source https://nuget.nexdev.net/api/v2

RUN --mount=type=cache,target=$NUGET_PACKAGES dotnet restore -v n -r linux-x64 ./WebSite1/WebSite1.csproj

COPY WebSite1/. ./WebSite1/
WORKDIR /src/WebSite1

RUN --mount=type=cache,target=$NUGET_PACKAGES dotnet publish -v n -r linux-x64 --self-contained false -o /app

#ENTRYPOINT ["tail", "-f", "/dev/null"]

FROM hub.nexdev.net/base/dotnet/core/aspnet:5.0-alpine AS base

# impersonate into the new user
RUN adduser --disabled-password \
  --home /app \
  --gecos '' dotnetuser && chown -R dotnetuser /app

USER dotnetuser
#
WORKDIR /app
COPY --from=builder /app .

ENV TZ="America/La_Paz"

ENTRYPOINT ["dotnet", "WebSite1.dll"]
