import { validarDadosLead } from '../services/validationService.js';
import { enviarWhatsAppTwilio, enviarWhatsAppMeta } from '../services/whatsappService.js';

export const criarLead = async (req, res, next) => {
    try {
        const dadosLead = req.body;

        const validacao = validarDadosLead(dadosLead);
        if (!validacao.valido) {
            return res.status(400).json({
                message: 'Dados inválidos',
                errors: validacao.erros
            });
        }

        const leadLimpo = {
            nome: dadosLead.nome.trim(),
            cpf: dadosLead.cpf.replace(/\D/g, ''),
            dataNascimento: dadosLead.dataNascimento,
            cep: dadosLead.cep.replace(/\D/g, ''),
            logradouro: dadosLead.logradouro.trim(),
            numero: dadosLead.numero.trim(),
            complemento: dadosLead.complemento?.trim() || '',
            bairro: dadosLead.bairro.trim(),
            cidade: dadosLead.cidade.trim(),
            estado: dadosLead.estado.trim(),
            consentimento: dadosLead.consentimento,
            dataHora: new Date().toISOString()
        };

        const mensagem = formatarMensagemWhatsApp(leadLimpo);

        const provider = process.env.WHATSAPP_PROVIDER || 'twilio';

        let resultado;
        if (provider === 'meta') {
            resultado = await enviarWhatsAppMeta(mensagem);
        } else {
            resultado = await enviarWhatsAppTwilio(mensagem);
        }

        res.status(201).json({
            message: 'Cadastro realizado com sucesso!',
            leadId: resultado.messageSid || resultado.messageId
        });

    } catch (error) {
        console.error('Erro ao processar lead:', error);
        next(error);
    }
};

function formatarMensagemWhatsApp(lead) {
    return `🆕 *NOVA CONSULTORA - ROMANCE*

📋 *Dados Cadastrais:*

👤 Nome: ${lead.nome}
🆔 CPF: ${formatarCPFParaMensagem(lead.cpf)}
🎂 Data Nascimento: ${lead.dataNascimento}

📍 *Endereço:*
${lead.logradouro}, ${lead.numero}${lead.complemento ? ` - ${lead.complemento}` : ''}
Bairro: ${lead.bairro}
${lead.cidade} - ${lead.estado}
CEP: ${formatarCEPParaMensagem(lead.cep)}

✅ Consentimento LGPD: ${lead.consentimento ? 'Confirmado' : 'Não'}
🕐 Data/Hora: ${new Date(lead.dataHora).toLocaleString('pt-BR')}

---
_Cadastro realizado via sistema Romance_`;
}

function formatarCPFParaMensagem(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarCEPParaMensagem(cep) {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}