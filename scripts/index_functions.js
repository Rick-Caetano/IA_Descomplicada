function controlarVisibilidadeBarra() {
    // Pega a posição da parte de baixo da seção "capa"
    const capaBottom = secaoCapa.getBoundingClientRect().bottom;

    // Se a parte de baixo da capa já passou do topo da tela, rolamos para além dela
    if (capaBottom < 0) {
        barraTopo.classList.add('visivel');
    } else {
        barraTopo.classList.remove('visivel');
    }
}

// 3. "escutador" ao evento de rolagem DO SEU CONTAINER
container.addEventListener('scroll', controlarVisibilidadeBarra);