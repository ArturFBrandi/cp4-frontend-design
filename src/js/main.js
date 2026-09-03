/* =========================================================================
   EcoTrend — Script da aplicação
   Contém apenas o que os requisitos pedem:
     1. Filtros laterais da página de categorias (preço, tipo e marca)
     2. Carrinho de compras (adicionar, ver itens, finalizar compra)
     3. Validação do formulário de contato (padrão do Bootstrap)
   Os cards de produto estão escritos diretamente no HTML.
   ========================================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const moeda = valor => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  /* ---------------------------------------------------------------------
     1. Filtros da página de categorias
     Cada card traz os dados nos atributos data-categoria, data-marca e
     data-preco; o filtro apenas mostra ou esconde os itens da grade.
     --------------------------------------------------------------------- */
  function iniciarFiltros() {
    const grade = $('#gradeProdutos');
    if (!grade) return;

    const itens = $$('.product-card', grade);
    const slider = $('#filtroPreco');
    const precoLabel = $('#precoLabel');

    function aplicar() {
      const categorias = $$('input[data-filtro="categoria"]:checked').map(i => i.value);
      const marcas = $$('input[data-filtro="marca"]:checked').map(i => i.value);
      const precoMax = slider ? Number(slider.value) : Infinity;

      itens.forEach(card => {
        const okCategoria = !categorias.length || categorias.includes(card.dataset.categoria);
        const okMarca = !marcas.length || marcas.includes(card.dataset.marca);
        const okPreco = Number(card.dataset.preco) <= precoMax;
        card.hidden = !(okCategoria && okMarca && okPreco);
      });
    }

    $$('input[data-filtro]').forEach(input => input.addEventListener('change', aplicar));

    if (slider) {
      slider.addEventListener('input', () => {
        if (precoLabel) precoLabel.textContent = moeda(Number(slider.value));
        aplicar();
      });
    }

    // categoria vinda da URL: categorias.html?cat=casa
    const cat = new URLSearchParams(location.search).get('cat');
    if (cat) {
      const check = $(`input[data-filtro="categoria"][value="${cat}"]`);
      if (check) check.checked = true;
    }

    aplicar();
  }

  /* ---------------------------------------------------------------------
     2. Carrinho de compras
     Persistido em localStorage para funcionar entre as páginas (site
     estático, sem backend). O painel (offcanvas) e o pop-up de confirmação
     são criados por JS e reaproveitados nas três páginas.
     --------------------------------------------------------------------- */
  const CHAVE_CARRINHO = 'ecotrend_carrinho';

  // Lê o carrinho do localStorage e normaliza o formato — protege contra
  // JSON corrompido, dado editado manualmente ou schema antigo, para que um
  // valor inesperado nunca vire NaN/erro na UI.
  function lerCarrinho() {
    let dados;
    try {
      dados = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
    } catch (erro) {
      console.warn('Carrinho corrompido no armazenamento local, iniciando vazio.', erro);
      return [];
    }
    if (!Array.isArray(dados)) return [];

    return dados
      .map(item => {
        const quantidade = Math.trunc(Number(item?.quantidade));
        return {
          id: String(item?.id ?? ''),
          nome: String(item?.nome ?? ''),
          preco: Number.isFinite(item?.preco) ? Number(item.preco) : 0,
          imagem: String(item?.imagem ?? ''),
          quantidade: quantidade > 0 ? quantidade : 1,
        };
      })
      .filter(item => item.id && item.nome);
  }

  function salvarCarrinho(itens) {
    try {
      localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
    } catch (erro) {
      console.warn('Não foi possível salvar o carrinho neste navegador.', erro);
    }
  }

  function parsePreco(texto) {
    // remove tudo que não for dígito ou vírgula (separador decimal pt-BR)
    const limpo = (texto || '').replace(/[^\d,]/g, '').replace(',', '.');
    return Number(limpo) || 0;
  }

  // Escapa texto antes de interpolar em innerHTML — o carrinho é lido de
  // volta do localStorage a cada render, e esse dado não deve ser tratado
  // como confiável só porque foi este script quem o escreveu originalmente.
  function escapeHtml(valor) {
    return String(valor ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Extrai nome, preço, imagem e um id estável (nome do arquivo da imagem)
  // a partir do botão clicado — funciona tanto num card da grade quanto na
  // página de detalhes do produto.
  function extrairProduto(botao) {
    const card = botao.closest('.product-card');
    // fora de um card da grade, escopa a busca ao <main> — nunca ao
    // document inteiro, já que o próprio painel do carrinho (injetado no
    // body) também tem um elemento .price__now (o total).
    const raiz = card || document.querySelector('main') || document;
    let nome, imagemEl;

    if (card) {
      nome = $('.card-title', card)?.textContent.trim();
      imagemEl = $('.product-card__media img', card);
    } else {
      nome = $('.product-title', raiz)?.textContent.trim();
      imagemEl = $('.produto-media img', raiz);
    }

    const precoTexto = $('.price__now', raiz)?.textContent;
    const imagem = imagemEl ? imagemEl.src : '';
    const id = imagem ? imagem.split('/').pop().replace(/\.[a-z0-9]+$/i, '') : nome;

    return { id, nome, preco: parsePreco(precoTexto), imagem };
  }

  function atualizarContadorCarrinho() {
    const total = lerCarrinho().reduce((soma, item) => soma + item.quantidade, 0);
    $$('.cart-count').forEach(el => { el.textContent = String(total); });
  }

  function renderizarCarrinho() {
    const lista = $('#carrinhoLista');
    if (!lista) return;
    const itens = lerCarrinho();

    lista.innerHTML = itens.length
      ? itens.map(item => `
        <div class="carrinho-item" data-id="${escapeHtml(item.id)}">
          <img src="${escapeHtml(item.imagem)}" alt="${escapeHtml(item.nome)}" class="carrinho-item__img">
          <div class="carrinho-item__info">
            <p class="carrinho-item__nome mb-0">${escapeHtml(item.nome)}</p>
            <p class="carrinho-item__preco mb-0">${moeda(item.preco)}</p>
            <div class="carrinho-item__qtd">
              <button type="button" data-acao="diminuir" aria-label="Diminuir quantidade">−</button>
              <span>${item.quantidade}</span>
              <button type="button" data-acao="aumentar" aria-label="Aumentar quantidade">+</button>
            </div>
          </div>
          <button type="button" class="carrinho-item__remover" data-acao="remover" aria-label="Remover produto">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>`).join('')
      : `<div class="carrinho-vazio"><i class="fa-solid fa-basket-shopping"></i><p class="mb-0">Seu carrinho está vazio.</p></div>`;

    const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
    const rotuloTotal = $('#carrinhoTotal');
    if (rotuloTotal) rotuloTotal.textContent = moeda(total);

    const botaoFinalizar = $('#botaoFinalizarCompra');
    if (botaoFinalizar) botaoFinalizar.disabled = itens.length === 0;
  }

  function adicionarAoCarrinho(produto) {
    const itens = lerCarrinho();
    const existente = itens.find(item => item.id === produto.id);
    // atualiza nome/preço/imagem para o snapshot atual da página — evita
    // que o carrinho fique preso ao preço de uma visita anterior.
    if (existente) Object.assign(existente, produto, { quantidade: existente.quantidade + 1 });
    else itens.push({ ...produto, quantidade: 1 });
    salvarCarrinho(itens);
    atualizarContadorCarrinho();
    renderizarCarrinho();
  }

  function alterarQuantidade(id, delta) {
    const itens = lerCarrinho()
      .map(item => item.id === id ? { ...item, quantidade: item.quantidade + delta } : item)
      .filter(item => item.quantidade > 0);
    salvarCarrinho(itens);
    atualizarContadorCarrinho();
    renderizarCarrinho();
  }

  function removerDoCarrinho(id) {
    salvarCarrinho(lerCarrinho().filter(item => item.id !== id));
    atualizarContadorCarrinho();
    renderizarCarrinho();
  }

  // O Bootstrap é carregado via CDN antes deste script; se o script falhar
  // (rede indisponível, bloqueio de terceiros), evita lançar um erro não
  // tratado dentro do handler de clique.
  function bootstrapDisponivel() {
    if (typeof bootstrap === 'undefined') {
      console.warn('Bootstrap não está disponível — não é possível abrir o carrinho.');
      return false;
    }
    return true;
  }

  function finalizarCompra() {
    if (!lerCarrinho().length) return;

    salvarCarrinho([]);
    atualizarContadorCarrinho();
    renderizarCarrinho();

    if (!bootstrapDisponivel()) return;

    const offcanvasEl = $('#offcanvasCarrinho');
    const modalEl = $('#modalCompraConfirmada');
    const mostrarModal = () => bootstrap.Modal.getOrCreateInstance(modalEl).show();

    const instanciaOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (instanciaOffcanvas) {
      offcanvasEl.addEventListener('hidden.bs.offcanvas', mostrarModal, { once: true });
      instanciaOffcanvas.hide();
    } else {
      mostrarModal();
    }
  }

  // Monta o offcanvas do carrinho e o modal de confirmação uma única vez.
  function criarPainelCarrinho() {
    if ($('#offcanvasCarrinho')) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="offcanvas offcanvas-end offcanvas-carrinho" tabindex="-1" id="offcanvasCarrinho" aria-labelledby="offcanvasCarrinhoLabel">
        <div class="offcanvas-header">
          <h2 class="offcanvas-title h5 mb-0" id="offcanvasCarrinhoLabel">
            <i class="fa-solid fa-basket-shopping"></i>Seu carrinho
          </h2>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Fechar"></button>
        </div>
        <div class="offcanvas-body d-flex flex-column">
          <div id="carrinhoLista" class="carrinho-lista flex-grow-1 overflow-auto"></div>
          <div class="carrinho-resumo">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-muted-eco fw-semibold">Total</span>
              <span class="price__now carrinho-total" id="carrinhoTotal">R$ 0,00</span>
            </div>
            <button type="button" class="btn btn-eco w-100" id="botaoFinalizarCompra" disabled>
              <i class="fa-solid fa-lock me-2"></i>Finalizar Compra
            </button>
          </div>
        </div>
      </div>
      <div class="modal fade modal-compra" id="modalCompraConfirmada" tabindex="-1" aria-labelledby="modalCompraConfirmadaLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content text-center">
            <div class="modal-body">
              <i class="fa-solid fa-circle-check d-block mb-3"></i>
              <h2 class="h4 mb-2" id="modalCompraConfirmadaLabel">Compra realizada com sucesso!</h2>
              <p class="text-muted-eco mb-4">Obrigado por comprar na EcoTrend. Você receberá os detalhes do pedido por e-mail em breve.</p>
              <button type="button" class="btn btn-eco" data-bs-dismiss="modal">Continuar comprando</button>
            </div>
          </div>
        </div>
      </div>`;

    document.body.append(...wrapper.children);

    $('#carrinhoLista').addEventListener('click', evento => {
      const alvo = evento.target.closest('[data-acao]');
      if (!alvo) return;
      const id = alvo.closest('.carrinho-item')?.dataset.id;
      if (!id) return;
      if (alvo.dataset.acao === 'aumentar') alterarQuantidade(id, 1);
      if (alvo.dataset.acao === 'diminuir') alterarQuantidade(id, -1);
      if (alvo.dataset.acao === 'remover') removerDoCarrinho(id);
    });

    $('#botaoFinalizarCompra').addEventListener('click', finalizarCompra);
  }

  function abrirCarrinho() {
    if (!bootstrapDisponivel()) return;
    bootstrap.Offcanvas.getOrCreateInstance($('#offcanvasCarrinho')).show();
  }

  function iniciarCarrinho() {
    criarPainelCarrinho();
    atualizarContadorCarrinho();
    renderizarCarrinho();

    const botaoCarrinho = $('#botaoCarrinho');
    if (botaoCarrinho) {
      botaoCarrinho.addEventListener('click', evento => {
        evento.preventDefault();
        abrirCarrinho();
      });
    }

    // delegado no body (em vez de um listener por botão): mesmo padrão do
    // #carrinhoLista, e continua funcionando se cards forem adicionados
    // dinamicamente à grade no futuro.
    document.body.addEventListener('click', evento => {
      const botao = evento.target.closest('[data-acao="adicionar-carrinho"]');
      if (!botao) return;

      const produto = extrairProduto(botao);
      if (!produto.nome || !(produto.preco > 0)) {
        console.warn('Não foi possível identificar o produto para adicionar ao carrinho.', produto);
        return;
      }
      adicionarAoCarrinho(produto);
      abrirCarrinho();
    });
  }

  /* ---------------------------------------------------------------------
     3. Validação do formulário de contato
     --------------------------------------------------------------------- */
  function iniciarFormulario() {
    const form = $('#formContato');
    if (!form) return;

    form.addEventListener('submit', evento => {
      evento.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        const invalido = form.querySelector(':invalid');
        if (invalido) invalido.focus();
        return;
      }

      form.classList.remove('was-validated');
      form.reset();
      $('#retornoContato').hidden = false;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    iniciarFiltros();
    iniciarCarrinho();
    iniciarFormulario();
  });
})();
