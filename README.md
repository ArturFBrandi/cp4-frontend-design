# EcoTrend — E-commerce de Produtos Sustentáveis

Checkpoint 04 — **Front-end Design** | FIAP

Interface responsiva de um e-commerce especializado em produtos sustentáveis e ecológicos,
desenvolvida com **HTML5, CSS3 (Grid Layout) e Bootstrap 5**.

**Aplicação online:** _adicione aqui o link do GitHub Pages após publicar_

---

## Integrantes do grupo

| Nome completo | RM |
| ------------- | -- |
| Artur Fabi Brandi  | RM570258 |
| Victor Bertacchini De Godoy   | RM571452 |
| Victor Lula Heineken Rodrigues   | RM570782 |

---

## Sobre o projeto

A **EcoTrend** é uma loja virtual fictícia especializada em produtos sustentáveis e ecológicos,
focada em promover um estilo de vida mais consciente. O catálogo tem 16 produtos divididos em
quatro categorias:

| Categoria | Exemplos |
| --------- | -------- |
| **Roupas e acessórios sustentáveis** | Camiseta de algodão orgânico, moletom de PET reciclado, tote bag de linho, tênis vegano |
| **Beleza e cuidados pessoais naturais** | Shampoo em barra, óleo facial botânico, sabonete artesanal, desodorante natural |
| **Itens para casa sustentáveis** | Talheres de bambu, garrafa térmica de inox, vela de cera de soja, escova de dentes de bambu |
| **Tecnologia verde** | Carregador solar, power bank solar, lâmpada LED inteligente, fone de bambu |

**Objetivo:** desenvolver uma interface responsiva de e-commerce utilizando HTML, CSS,
Grid Layout e Bootstrap, aplicando componentes do framework e sobrescrevendo seus estilos
para manter uma identidade visual própria da loja.

---

## Componentes do projeto

### 1. Página Inicial — `index.html`
- **Header:** barra de navegação com logo, menu e ícone de carrinho.
- **Banner:** carrossel do Bootstrap com 3 slides destacando promoções e produtos.
- **Seções de produtos:** quatro seções, uma por categoria, com os produtos em grid de
  colunas do Bootstrap usando o componente **card**.

### 2. Página de Categorias — `categorias.html`
- Lista de produtos em **layout de grid** (CSS Grid), com imagem, nome, preço e botão
  **"Adicionar ao Carrinho"**.
- **Filtros laterais** montados com colunas do Bootstrap, permitindo filtrar por
  **preço**, **tipo de produto** e **marca**.
- Aceita a categoria pela URL: `categorias.html?cat=casa`.

### 3. Página de Detalhes do Produto — `produto.html`
- Imagem em destaque, nome, marca, preço (com preço anterior), descrição completa,
  tabela de especificações e botão de compra.

### 4. Página de Contato — `contato.html`
- **Formulário estilizado com Bootstrap** com os campos **nome, e-mail, assunto e mensagem**,
  validação e mensagem de confirmação.
- Bloco lateral com as informações de atendimento.

### 5. Footer (em todas as páginas)
- Links para redes sociais, informações de contato e políticas da loja.

---

## Tarefas de desenvolvimento

| Tarefa | Como foi aplicada |
| ------ | ----------------- |
| **Estruturação de Grid** | `display: grid` na grade de produtos da página de categorias (`auto-fill`/`minmax`) e no rodapé, combinado ao grid de 12 colunas do Bootstrap (`row`/`col`) no restante do layout. |
| **Responsividade** | *Media queries* em 4 breakpoints (1199px, 991px, 767px, 575px) ajustando grids, margens e tipografia, além de fontes fluidas com `clamp()` e menu recolhível no mobile. |
| **Uso de componentes do Bootstrap** | Carousel, Card, Navbar, Dropdown, Collapse, Breadcrumb, Form (com validação), Form Range e Form Check. |
| **Estilização personalizada** | Sobrescrita das variáveis do Bootstrap (`--bs-*`) e de seus componentes em `css/style.css`, com paleta, tipografia, botões, cards e formulários próprios da marca. |

---

## Ferramentas utilizadas

- **[Bootstrap 5.3](https://getbootstrap.com/)** — framework CSS para desenvolvimento web responsivo.
- **[Font Awesome 6](https://fontawesome.com/)** — biblioteca de ícones para web.
- **[Google Fonts](https://fonts.google.com/)** — tipografia *Fraunces* (títulos) e *Plus Jakarta Sans* (texto).
- **SVG** — ilustrações dos produtos criadas para o projeto, sem dependência de imagens externas.

> Os cards de produto estão escritos diretamente no HTML. O arquivo `js/main.js` contém
> apenas duas funções: os filtros da página de categorias e a validação do formulário de contato.

---

## Estrutura de arquivos

```
cp4-frontend-design/
├── index.html            # Página inicial (header, carrossel, seções de produtos)
├── categorias.html       # Catálogo com filtros laterais
├── produto.html          # Detalhes do produto
├── contato.html          # Formulário de contato
├── css/
│   └── style.css         # Estilos personalizados (sobrescreve o Bootstrap)
├── js/
│   └── main.js           # Filtros do catálogo e validação do formulário
├── assets/
│   └── img/              # Ilustrações SVG dos produtos e favicon
└── README.md
```

---

## Como executar localmente

O projeto é estático, sem dependências de build:

```bash
git clone https://github.com/ArturFBrandi/cp4-frontend-design.git
cd cp4-frontend-design
python3 -m http.server 8000
# acesse http://localhost:8000
```

Também é possível abrir o `index.html` diretamente no navegador.

---