# SEO — Lista de Tarefas

Tarefas ordenadas por prioridade e impacto para melhorar o ranqueamento do site **lui-tecnologia.com**.

---

## 🔴 #1 — Google Search Console

**Por que fazer:** É o canal oficial de comunicação com o Google. Sem isso, o Google pode demorar semanas para indexar o site. Com ele, a indexação é imediata e você consegue monitorar cliques, impressões e erros.

**Passo a passo:**

1. Acesse [search.google.com/search-console](https://search.google.com/search-console)
2. Clique em **"Adicionar propriedade"** → escolha **"Prefixo de URL"**
3. Digite `https://lui-tecnologia.com/`
4. Faça a verificação de propriedade — o método mais fácil é via **tag HTML**:
   - Copie a meta tag fornecida pelo Google (ex: `<meta name="google-site-verification" content="XXXX" />`)
   - Cole no `<head>` do `index.html`, logo após a tag `<meta charset>`
   - Faça o deploy e clique em **"Verificar"**
5. Após verificado, vá em **"Sitemaps"** (menu lateral esquerdo)
6. No campo, cole: `https://lui-tecnologia.com/sitemap.xml`
7. Clique em **"Enviar"**

**Resultado esperado:** Indexação em 24–72 horas. Monitoramento de performance disponível em ~7 dias.

---

## 🔴 #2 — Google Business Profile (Perfil da Empresa)

**Por que fazer:** É o fator #1 para aparecer em buscas locais como "empresa de tecnologia São Luís" ou "desenvolvimento web São Paulo". Aparecer no mapa do Google é gratuito e de alto impacto.

**Passo a passo:**

1. Acesse [business.google.com](https://business.google.com) com a conta Google da empresa
2. Clique em **"Gerenciar agora"** → **"Adicionar sua empresa"**
3. Preencha:
   - **Nome:** LUi Tecnologia
   - **Categoria:** Empresa de desenvolvimento de software (ou similar)
   - **Localização:** São Luís, Maranhão, Brasil
   - **Área de atendimento:** Todo o Brasil
   - **Site:** `https://lui-tecnologia.com`
   - **Telefone:** +55 (98) 99109-2411
   - **E-mail:** luitecnologia@gmail.com
4. Faça a verificação do perfil (geralmente por carta enviada ao endereço, ou por telefone)
5. Após verificado, adicione:
   - Descrição da empresa (use palavras-chave: "desenvolvimento web", "aplicativos mobile", "consultoria técnica")
   - Logo e fotos
   - Horário de atendimento
   - Serviços oferecidos
6. Repita o processo para São Paulo, SP (perfil secundário ou área de atendimento)

**Dica:** Peça para clientes deixarem avaliações (estrelas + comentário) — isso melhora muito o ranqueamento local.

---

## 🟡 #3 — Core Web Vitals (PageSpeed)

**Por que fazer:** O Google usa LCP, CLS e FID como fatores de ranqueamento direto. Um site lento perde posições mesmo com bom conteúdo.

**Passo a passo:**

1. Acesse [pagespeed.web.dev](https://pagespeed.web.dev/)
2. Cole `https://lui-tecnologia.com/` e clique em **"Analisar"**
3. Rode primeiro no modo **Mobile** (é o mais crítico para o Google)
4. Metas a atingir:
   - **LCP** (Largest Contentful Paint): < 2,5s
   - **CLS** (Cumulative Layout Shift): < 0,1
   - **FID/INP** (Interaction to Next Paint): < 200ms
5. Correções comuns se a nota for baixa:
   - **Google Fonts lento:** já tem `preconnect` + `preload` no HTML — verifique se estão antes do `<link rel="stylesheet">` da fonte ✓
   - **Imagem OG grande:** comprima `assets/images/og-image.png` em [squoosh.app](https://squoosh.app) (meta: < 200kb)
   - **CLS por fontes:** adicionar `font-display: swap` na URL do Google Fonts (já pode estar presente — verificar)
6. Rode também o **Lighthouse** local:
   - Chrome DevTools → aba **Lighthouse** → Mobile → **Analyze page load**

---

## 🟡 #4 — Expandir conteúdo textual (palavras-chave)

**Por que fazer:** O Google precisa de texto para entender sobre o que a página fala. Seções com poucas palavras têm menos peso. Conteúdo rico em palavras-chave relevantes melhora o ranqueamento orgânico.

**O que fazer em `index.html`:**

### Seção Sobre (`#about`)
Acrescente um terceiro parágrafo mencionando tecnologias e especialidades, por exemplo:
> "Nossa stack inclui React, Next.js, Node.js, React Native e Flutter — escolhidas sempre em função do melhor resultado para cada projeto, não por modismo."

### Cards de Serviços (`#services`)
Expanda cada `service-description` com 2–3 frases adicionais:
- **Web:** mencione React, Next.js, Node.js, performance, SEO técnico
- **Mobile:** mencione iOS, Android, React Native, Flutter, lojas de aplicativos
- **Consultoria:** mencione arquitetura de sistemas, code review, microsserviços, cloud

### Seção Por que LUi (`#why`)
Inclua exemplos concretos ou números nas descrições dos diferenciais.

**Palavras-chave alvo a incluir naturalmente:**
- `desenvolvimento web São Luís`
- `desenvolvimento web São Paulo`
- `aplicativo mobile Brasil`
- `consultoria técnica React`
- `empresa de tecnologia Maranhão`

---

## 🟢 #5 — Diretórios e backlinks

**Por que fazer:** Links de outros sites apontando para o seu (backlinks) são um dos maiores fatores de ranqueamento do Google. Diretórios de empresas são a forma mais rápida de conseguir backlinks de qualidade.

**Lista de plataformas para cadastrar:**

| Plataforma | URL | Prioridade |
|---|---|---|
| LinkedIn (página empresa) | [linkedin.com/company](https://linkedin.com/company) | Alta |
| Clutch.co | [clutch.co](https://clutch.co) | Alta |
| GitHub (perfil org) | [github.com](https://github.com) | Média |
| Hotmart / AppSumo (se aplicável) | — | Baixa |
| ABComm | [abcomm.org](https://abcomm.org) | Média |
| Reclame Aqui (perfil gratuito) | [reclameaqui.com.br](https://reclameaqui.com.br) | Média |
| Provedores locais MA/SP | Buscar "diretório empresas Maranhão" | Alta (local SEO) |

**Em cada cadastro:**
- Use sempre o mesmo nome: **LUi Tecnologia**
- Inclua o site: `https://lui-tecnologia.com`
- Mesma descrição curta: *"Empresa de desenvolvimento web, aplicativos mobile e consultoria técnica com atuação em todo o Brasil."*
- Inclua e-mail e WhatsApp

**Conteúdo no LinkedIn:**
- Publique um artigo ou post sobre um projeto/tecnologia e inclua o link do site
- Posts com link geram tráfego referenciado E backlink

---

## 📋 Resumo de Progresso

- [x] #1 — Google Search Console configurado e sitemap enviado ✅
- [ ] #2 — Google Business Profile criado e verificado (São Luís)
- [ ] #2b — Google Business Profile criado e verificado (São Paulo)
- [x] #3 — PageSpeed Mobile Score ≥ 90 (91 mobile, 99 desktop) ✅
- [x] #3b — Fontes auto-hospedadas para reduzir FCP/LCP abaixo de 2,5s ✅
- [ ] #4 — Conteúdo das seções Sobre, Serviços e Por que LUi expandido
- [ ] #5 — LinkedIn, Clutch e demais diretórios cadastrados
