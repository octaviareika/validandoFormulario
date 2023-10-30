var formulario = document.querySelector('.formulario');
var campoObrigatorio = document.querySelectorAll('[required]');

formulario.addEventListener("submit", function(event){
    event.preventDefault(); 
    
    console.log(event)
    //console.log(event.target);
    const lista = {
        "nome": event.target.elements["nomeSobrenome"].value, // ou elements[nome do campo]
        "email": event.target.elements["email"].value,
        "cpf": event.target.elements["cpf"].value, // o valor que tem dentro do campo cpf 
        "aniversario": event.target.elements["aniversario"].value,
    }

    localStorage.setItem("cadastro", JSON.stringify(lista)); // converter em string (armazenando dados no navegador)



});

campoObrigatorio.forEach(campo => {
    campo.addEventListener("blur", () => verificaCampo(campo)); // sumir aquele indicador que dá resposta da verificação em cada campo 
    campo.addEventListener("invalid", e => e.preventDefault()); // quando der algo invalido, impedir com que a página se recarregue // remover pop-up 

});

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'tooShort',
    'customError'
]

const mensagemParaCadaErro = {
    "nomeSobrenome": { // nome e valor(significado do erro)
        valueMissing: "O campo de nome não pode estar vazio.",
        patternMismatch: "Por favor, preencha um nome válido.",
        tooShort: "Por favor, preencha um nome válido."
    },
    "email": {
        valueMissing: "O campo de e-mail não pode estar vazio.",
        typeMismatch: "Por favor, preencha um email válido.",
        tooShort: "Por favor, preencha um email válido."
    },
    "cpf": {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        patternMismatch: "Por favor, preencha um CPF válido.",
        customError: "O CPF digitado não existe.",
        tooShort: "O campo de CPF não tem caractéres suficientes."
    },
    "aniversario": {
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        customError: 'Você deve ser maior que 18 anos para se cadastrar.'
    },
}


function verificaCampo(campo){
    let mensagem = "";
    campo.setCustomValidity(''); // ainda não há mensagem de erro (mensagem personalizada)

    //if (campo.name == "email" && campo.value.includes("@") == false){
        //campo.setCustomValidity('E-mail incorreto');
    //}

    if (campo.name == "cpf" && campo.value.length >= 11){
        var cpf = campo.value.replace(/\.|-/g, ""); // no lugar no campo fica a forma do digito que ira aparecer (regex)

        if (verificaNumerosRepetidos(cpf) || (verificaPrimeiroDigito(cpf)) || (verificaSegundoDigito(cpf))){
            campo.setCustomValidity('Esse cpf não existe');
        }
        
    }

    //validity: aparece todos os tipos de erros

    if (campo.name == "aniversario" && campo.value != ""){
        const data = new Date(campo.value);
        if(!verificaIdade(data)){
            campo.setCustomValidity('Não é maior de idade'); 
        }

    }



    tiposDeErro.forEach(erro => { // para cada tipo de erro

    
        if (campo.validity[erro] == true){ // se o validity der true nesse determinado erro
            mensagem = mensagemParaCadaErro[campo.name][erro];
           
        }
    });

    const mensagemErro = campo.parentNode.querySelector('.mensagem-erro'); // dentro, pega todos os campos
    var validadorInput = campo.checkValidity();
    if (!validadorInput){
        mensagemErro.textContent = mensagem;
    }
    else {
        mensagemErro.textContent = "";
    }

    
}


/////////////////////// função para verificar cpf //////////////////////////////

function verificaNumerosRepetidos(cpf){
    const numerosRepetidosCPF = [
        "00000000000",
        "11111111111",
        "22222222222",
        "33333333333",
        "44444444444",
        "55555555555",
        "66666666666",
        "77777777777",
        "88888888888",
        "99999999999"
    ]

    return numerosRepetidosCPF.includes(cpf); // retorna um booleano (true ou false)
}

function verificaPrimeiroDigito(cpf){
    let soma = 0;
    let multiplicador = 10;

    for (let tamanho = 0; tamanho < 9; tamanho++) {
        soma += cpf[tamanho] * multiplicador;
        multiplicador--
    }

    soma = (soma * 10) % 11;

    if (soma == 10 || soma == 11) {
        soma = 0;
    }

    if (soma != cpf[9]){
        return true;
    } // true
    
    
    return false; 


}

function verificaSegundoDigito(cpf){
    let soma = 0;
    let multiplicador = 11;

    for (let tamanho = 0; tamanho < 10; tamanho++) {
        soma += cpf[tamanho] * multiplicador;
        multiplicador--
    }

    soma = (soma * 10) % 11;

    if (soma == 10 || soma == 11) {
        soma = 0;
    }

    if (soma != cpf[10]){
        return true;
    }

    return false;
    

}

/////////////// funções para validar aniversário ////////////////////

// data = data de nascimento que a pessoa colocou no valor do campo
function verificaIdade(data){
    const dataAtual = new Date();
    const dataDaquiA18Anos = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());

    if (dataAtual < dataDaquiA18Anos){ // significa que eh menor de idade 
        return false;
    }

    else {
        return true;
    }

    
}
