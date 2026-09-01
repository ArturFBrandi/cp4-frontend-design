/* =========================================================================
   EcoTrend — Script da aplicação
   Contém apenas o que os requisitos pedem:
     1. Filtros laterais da página de categorias (preço, tipo e marca)
     2. Validação do formulário de contato (padrão do Bootstrap)
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
     2. Validação do formulário de contato
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
    iniciarFormulario();
  });
})();
