import twilio from 'twilio';
import axios from 'axios';

// ========== OPÇÃO 1: TWILIO ==========
export const enviarWhatsAppTwilio = async (mensagem) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM; // whatsapp:+14155238886
    const to = process.env.TWILIO_WHATSAPP_TO; // whatsapp:+5511999999999

    if (!accountSid || !authToken) {
        throw new Error('Credenciais Twilio não configuradas');
    }

    const client = twilio(accountSid, authToken);

    try {
        const message = await client.messages.create({
            body: mensagem,
            from: from,
            to: to
        });

        console.log('✅ WhatsApp enviado via Twilio:', message.sid);
        return {
            success: true,
            messageSid: message.sid,
            provider: 'twilio'
        };

    } catch (error) {
        console.error('❌ Erro Twilio:', error.message);
        throw new Error(`Erro ao enviar WhatsApp: ${error.message}`);
    }
};

// ========== OPÇÃO 2: META WHATSAPP CLOUD API ==========
export const enviarWhatsAppMeta = async (mensagem) => {
    const token = process.env.META_WHATSAPP_TOKEN;
    const phoneId = process.env.META_WHATSAPP_PHONE_ID;
    const to = process.env.META_WHATSAPP_TO; // 5511999999999 (sem +)

    if (!token || !phoneId) {
        throw new Error('Credenciais Meta WhatsApp não configuradas');
    }

    const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;

    try {
        const response = await axios.post(
            url,
            {
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: {
                    body: mensagem
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ WhatsApp enviado via Meta:', response.data);
        return {
            success: true,
            messageId: response.data.messages[0].id,
            provider: 'meta'
        };

    } catch (error) {
        console.error('❌ Erro Meta API:', error.response?.data || error.message);
        throw new Error(`Erro ao enviar WhatsApp Meta: ${error.message}`);
    }
};