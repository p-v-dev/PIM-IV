# Distribuicao do EduQuest

O workflow [Release Windows and Android](../.github/workflows/release-clients.yml) publica dois arquivos em **GitHub Releases** depois que os dois builds passam:

- `EduQuest-Admin-Windows-x64.exe`: instalador Windows 64 bits com o .NET incluido. Pode aparecer um aviso do SmartScreen porque o instalador nao tem assinatura Authenticode.
- `EduQuest-Aluno-Android.apk`: instalador assinado para Android. Se o telefone pedir, autorize a instalacao de aplicativos da fonte usada para abrir o download.

## Antes da primeira release

Crie uma chave de assinatura Android no seu computador com o `keytool` do JDK. Rode fora da pasta do repositorio e guarde uma copia segura da chave e das senhas:

```powershell
keytool -genkeypair -keystore eduquest-release.jks -storetype JKS -alias eduquest -keyalg RSA -keysize 2048 -validity 10000
```

Em **Settings > Environments > PROD > Environment secrets**, cadastre:

| Nome | Valor |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | Arquivo `.jks` em Base64, sem quebras de linha |
| `ANDROID_KEYSTORE_PASSWORD` | Senha da keystore |
| `ANDROID_KEY_ALIAS` | `eduquest`, se usou o comando acima |
| `ANDROID_KEY_PASSWORD` | Senha da chave; pode ser igual a da keystore |

No PowerShell, `[Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path ./eduquest-release.jks).Path)) | Set-Clipboard` coloca a chave codificada na area de transferencia, sem exibi-la. Nao envie a chave ou os segredos ao Git ou pelo chat. **Reuse exatamente a mesma chave nas proximas releases**, senao o Android nao aceita a atualizacao sobre a instalacao anterior.

A variavel opcional `EDUQUEST_API_URL`, em **Actions > Variables**, troca o endereco HTTPS da API nos dois builds. Sem ela, os clientes usam o dominio atual do EduQuest no Azure. Informe apenas a origem, sem caminho ou credenciais.

## Publicar

Depois que o workflow estiver no GitHub, crie uma tag nova no commit que quer distribuir e envie a tag:

```powershell
git tag v1.0.0
git push origin v1.0.0
```

Acompanhe **Actions > Release Windows and Android**. Os dois arquivos aparecem na mesma Release quando os builds e a verificacao da assinatura terminarem. Para atualizar os aplicativos, use uma tag maior, como `v1.0.1`. Esse workflow nao publica nem altera a API no Azure.
