// Validação de CPF (algoritmo completo)
export const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');

    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
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
};

// Formatar CPF
export const formatarCPF = (valor) => {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .substring(0, 14);
};

// Formatar Data (DD/MM/AAAA)
export const formatarData = (valor) => {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 10);
};

// Validar Data de Nascimento
export const validarDataNascimento = (data) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(data)) return false;

    const [, dia, mes, ano] = data.match(regex);
    const dataObj = new Date(ano, mes - 1, dia);

    // Verifica se a data é válida
    if (
        dataObj.getDate() !== parseInt(dia) ||
        dataObj.getMonth() !== parseInt(mes) - 1 ||
        dataObj.getFullYear() !== parseInt(ano)
    ) {
        return false;
    }

    // Verifica se a pessoa tem pelo menos 18 anos
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataObj.getFullYear();
    const m = hoje.getMonth() - dataObj.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataObj.getDate())) {
        idade--;
    }

    return idade >= 18 && idade <= 120;
};

// Formatar CEP
export const formatarCEP = (valor) => {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 9);
};

// Validar CEP e buscar endereço (ViaCEP API)
export const buscarEnderecoPorCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        return { erro: true, mensagem: 'CEP inválido' };
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await response.json();

        if (dados.erro) {
            return { erro: true, mensagem: 'CEP não encontrado' };
        }

        return {
            erro: false,
            logradouro: dados.logradouro || '',
            bairro: dados.bairro || '',
            cidade: dados.localidade || '',
            estado: dados.uf || ''
        };
    } catch (error) {
        return { erro: true, mensagem: 'Erro ao buscar CEP' };
    }
};