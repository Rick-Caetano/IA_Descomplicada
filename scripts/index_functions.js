document.addEventListener('DOMContentLoaded', () => {

    const barraTopo = document.getElementById('barra-topo');
    const secaoCapa = document.getElementById('capa');
    const containerDeRolagem = document.querySelector('.scroll-container');

    function controlarVisibilidadeBarra() {
        // Pega a posição da parte de baixo da seção "capa" em relação à janela.
            const posicaoCapa = secaoCapa.getBoundingClientRect();

        // Se a parte de baixo da capa já passou do topo da tela, rolamos para além dela
        if (posicaoCapa.bottom < 0) {
            barraTopo.classList.add('visivel');
        } else {
            barraTopo.classList.remove('visivel');
        }
    }

    // 3. "escutador" ao evento de rolagem DO SEU CONTAINER
    containerDeRolagem.addEventListener('scroll', controlarVisibilidadeBarra);

});