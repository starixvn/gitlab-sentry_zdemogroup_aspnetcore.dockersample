FROM hub.nexdev.net/base/dotnet/core/sdk:5.0.102-ca-patch-buster-slim AS builder
WORKDIR /src

COPY *.sln .
COPY WebSite1/*.csproj ./WebSite1/
COPY WebSite2/*.csproj ./WebSite2/
COPY CommonLibs/*.csproj ./CommonLibs/
#COPY tests/Website1.Tests/*.csproj ./tests/Website1.Tests/

RUN dotnet nuget add source http://nuget.nexdev.net/api/v2
#RUN dotnet restore -v n

COPY CommonLibs/. ./CommonLibs/
COPY WebSite2/. ./WebSite2/
WORKDIR /src/WebSite2
RUN dotnet publish -r linux-x64 --self-contained false -o /app

FROM hub.nexdev.net/base/dotnet/core/aspnet:5.0-buster-slim AS base

RUN sed -i 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=1/g' /usr/lib/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /usr/lib/ssl/openssl.cnf

WORKDIR /app
COPY --from=builder /app .
ENV TZ="America/La_Paz"

ENTRYPOINT ["dotnet", "WebSite2.dll"]
