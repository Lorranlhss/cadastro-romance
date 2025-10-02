export const validarDadosLead = (dados) => {
    const erros = [];

    if (!dados.nome || dados.nome.trim().length < 3) {
        erros.push({ campo: 'nome', mensagem: 'Nome deve ter no mínimo 3 caracteres' });
    }

    if (!validarCPF(dados.cpf)) {
        erros.push({ campo: 'cpf', mensagem: 'CPF inválido' });
    }

    if (!validarDataNascimento(dados.dataNascimento)) {
        erros.push({ campo: 'dataNascimento', mensagem: 'Data de nascimento inválida ou menor de 18 anos' });
    }

    const cep = dados.cep.replace(/\D/g, '');
    if (cep.length !== 8) {
        erros.push({ campo: 'cep', mensagem: 'CEP inválido' });
    }

    if (!dados.logradouro || dados.logradouro.trim().length < 3) {
        erros.push({ campo: 'logradouro', mensagem: 'Logradouro inválido' });
    }

    if (!dados.numero || dados.numero.trim().length === 0) {
        erros.push({ campo: 'numero', mensagem: 'Número é obrigatório' });
    }

    if (!dados.bairro || dados.bairro.trim().length < 2) {
        erros.push({ campo: 'bairro', mensagem: 'Bairro inválido' });
    }

    if (!dados.cidade || dados.cidade.trim().length < 2) {
        erros.push({ campo: 'cidade', mensagem: 'Cidade inválida' });
    }

    const estadosValidos = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
    if (!dados.estado || !estadosValidos.includes(dados.estado)) {
        erros.push({ campo: 'estado', mensagem: 'Estado inválido' });
    }

    if (dados.consentimento !== true) {
        erros.push({ campo: 'consentimento', mensagem: 'Consentimento obrigatório' });
    }

    return {
        valido: erros.length === 0,
        erros
    };
};

function validarCPF(cpf) {
    if (!cpf) return false;
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

function validarDataNascimento(data) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(data)) return false;

    const [, dia, mes, ano] = data.match(regex);
    const dataObj = new Date(ano, mes - 1, dia);

    if (
        dataObj.getDate() !== parseInt(dia) ||
        dataObj.getMonth() !== parseInt(mes) - 1 ||
        dataObj.getFullYear() !== parseInt(ano)
    ) {
        return false;
    }

    const hoje = new Date();
    let idade = hoje.getFullYear() - dataObj.getFullYear();
    const m = hoje.getMonth() - dataObj.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataObj.getDate())) {
        idade--;
    }

    return idade >= 18 && idade <= 120;
}