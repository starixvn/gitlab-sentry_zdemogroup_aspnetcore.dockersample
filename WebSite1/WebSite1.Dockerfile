FROM registry.nexdev.net:5050/docker/dotnet/core/sdk:5.0.102-ca-patch-buster-slim AS builder
WORKDIR /src

# Install the tools
RUN dotnet tool install --tool-path /tools dotnet-trace
RUN dotnet tool install --tool-path /tools dotnet-dump
RUN dotnet tool install --tool-path /tools dotnet-counters

COPY *.sln .
COPY WebSite1/*.csproj ./WebSite1/
COPY WebSite2/*.csproj ./WebSite2/
COPY tests/Website1.Tests/*.csproj ./tests/Website1.Tests/
RUN dotnet nuget add source http://nuget.nexdev.net/api/v2
RUN dotnet restore -v n

COPY WebSite1/. ./WebSite1/
WORKDIR /src/WebSite1
RUN dotnet publish -r linux-x64 --self-contained false -o /app

FROM registry.nexdev.net:5050/docker/dotnet/core/aspnet:5.0-buster-slim-new AS base
#5.0-buster-slim 5.0-alpine-amd64
RUN apt-get update
RUN apt-get install curl -y
RUN sed -i 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=1/g' /usr/lib/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /usr/lib/ssl/openssl.cnf

# impersonate into the new user
RUN adduser --disabled-password \
  --home /app \
  --gecos '' dotnetuser && chown -R dotnetuser /app

USER dotnetuser
#
WORKDIR /app
COPY --from=builder /app .
COPY --from=builder /tools /tools
ENV TZ="America/La_Paz"

ENTRYPOINT ["dotnet", "WebSite1.dll"]
