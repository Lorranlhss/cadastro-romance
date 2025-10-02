import { useState } from 'react';
import axios from 'axios';
import {
    validarCPF,
    validarDataNascimento,
    formatarCPF,
    formatarData,
    formatarCEP,
    buscarEnderecoPorCEP
} from '../utils/validators';
import Loader from './Loader';

const FormularioCadastro = () => {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        dataNascimento: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        consentimento: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingCEP, setLoadingCEP] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        if (name === 'cpf') newValue = formatarCPF(value);
        if (name === 'dataNascimento') newValue = formatarData(value);
        if (name === 'cep') {
            newValue = formatarCEP(value);
            if (newValue.replace(/\D/g, '').length === 8) {
                buscarCEP(newValue);
            }
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const buscarCEP = async (cep) => {
        setLoadingCEP(true);
        const resultado = await buscarEnderecoPorCEP(cep);

        if (!resultado.erro) {
            setFormData(prev => ({
                ...prev,
                logradouro: resultado.logradouro,
                bairro: resultado.bairro,
                cidade: resultado.cidade,
                estado: resultado.estado
            }));
        } else {
            setErrors(prev => ({ ...prev, cep: resultado.mensagem }));
        }
        setLoadingCEP(false);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nome.trim() || formData.nome.length < 3) {
            newErrors.nome = 'Nome completo é obrigatório (mínimo 3 caracteres)';
        }

        if (!validarCPF(formData.cpf)) {
            newErrors.cpf = 'CPF inválido';
        }

        if (!validarDataNascimento(formData.dataNascimento)) {
            newErrors.dataNascimento = 'Data inválida ou menor de 18 anos';
        }

        const cepNumeros = formData.cep.replace(/\D/g, '');
        if (cepNumeros.length !== 8) {
            newErrors.cep = 'CEP inválido';
        }

        if (!formData.logradouro.trim()) {
            newErrors.logradouro = 'Logradouro é obrigatório';
        }

        if (!formData.numero.trim()) {
            newErrors.numero = 'Número é obrigatório';
        }

        if (!formData.bairro.trim()) {
            newErrors.bairro = 'Bairro é obrigatório';
        }

        if (!formData.cidade.trim()) {
            newErrors.cidade = 'Cidade é obrigatória';
        }

        if (!formData.estado || formData.estado === '') {
            newErrors.estado = 'Estado é obrigatório';
        }

        if (!formData.consentimento) {
            newErrors.consentimento = 'Você precisa concordar com os termos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        if (!validateForm()) return;

        setLoading(true);

        try {
            await axios.post('/api/leads', formData);

            setSubmitStatus({
                type: 'success',
                message: '✅ Cadastro realizado com sucesso! Em breve entraremos em contato.'
            });

            setFormData({
                nome: '',
                cpf: '',
                dataNascimento: '',
                cep: '',
                logradouro: '',
                numero: '',
                complemento: '',
                bairro: '',
                cidade: '',
                estado: '',
                consentimento: false
            });

        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: error.response?.data?.message || '❌ Erro ao enviar cadastro. Tente novamente.'
            });
        } finally {
            setLoading(false);
        }
    };

    const estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-4 sm:py-8 md:py-12 px-3 sm:px-4 lg:px-6">

            {/* Background decorativo */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-romance-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-40 w-72 sm:w-96 h-72 sm:h-96 bg-purple-300/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 right-1/3 w-60 sm:w-80 h-60 sm:h-80 bg-blue-300/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-3xl mx-auto relative z-10">

                {/* Header com Logo */}
                <div className="text-center mb-6 sm:mb-8 md:mb-10 animate-fade-in">
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-romance-primary to-purple-500 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
                            <img
                                src="/logo-romance.svg"
                                alt="Romance Logo"
                                className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 transform group-hover:scale-105 transition-transform drop-shadow-2xl"
                            />
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-romance-primary via-purple-600 to-pink-600 bg-clip-text text-transparent px-4">
                        Seja uma Consultora Romance
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto px-4">
                        Transforme sua paixão em renda 💄✨
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm px-4">
                        <div className="text-center">
                            <div className="font-bold text-lg sm:text-xl md:text-2xl text-romance-primary">+10k</div>
                            <div className="text-gray-600">Consultoras</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-lg sm:text-xl md:text-2xl text-purple-600">30%</div>
                            <div className="text-gray-600">De Comissão</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-lg sm:text-xl md:text-2xl text-pink-600">100%</div>
                            <div className="text-gray-600">Flexível</div>
                        </div>
                    </div>
                </div>

                {/* Card Principal */}
                <div className="backdrop-blur-xl bg-white/80 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-white/20">

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">

                        {/* Nome Completo */}
                        <div className="group">
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-romance-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                </svg>
                                <span>Nome Completo</span>
                            </label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/50 border-2 rounded-lg sm:rounded-xl transition-all duration-300 outline-none
                  ${errors.nome
                                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                    : 'border-gray-200 focus:border-romance-primary focus:ring-4 focus:ring-romance-primary/10'
                                }
                  hover:border-romance-primary/50 placeholder:text-gray-400`}
                                placeholder="Maria da Silva"
                            />
                            {errors.nome && (
                                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                    </svg>
                                    {errors.nome}
                                </p>
                            )}
                        </div>

                        {/* CPF e Data de Nascimento */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">

                            {/* CPF */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-romance-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd"/>
                                    </svg>
                                    <span>CPF</span>
                                </label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/50 border-2 rounded-lg sm:rounded-xl transition-all duration-300 outline-none
                    ${errors.cpf
                                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                        : 'border-gray-200 focus:border-romance-primary focus:ring-4 focus:ring-romance-primary/10'
                                    }
                    hover:border-romance-primary/50 placeholder:text-gray-400`}
                                    placeholder="000.000.000-00"
                                    maxLength={14}
                                />
                                {errors.cpf && (
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600">{errors.cpf}</p>
                                )}
                            </div>

                            {/* Data de Nascimento */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-romance-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                                    </svg>
                                    <span>Data de Nascimento</span>
                                </label>
                                <input
                                    type="text"
                                    name="dataNascimento"
                                    value={formData.dataNascimento}
                                    onChange={handleChange}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/50 border-2 rounded-lg sm:rounded-xl transition-all duration-300 outline-none
                    ${errors.dataNascimento
                                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                        : 'border-gray-200 focus:border-romance-primary focus:ring-4 focus:ring-romance-primary/10'
                                    }
                    hover:border-romance-primary/50 placeholder:text-gray-400`}
                                    placeholder="DD/MM/AAAA"
                                    maxLength={10}
                                />
                                {errors.dataNascimento && (
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600">{errors.dataNascimento}</p>
                                )}
                            </div>
                        </div>

                        {/* Endereço - Título */}
                        <div className="pt-2 sm:pt-4">
                            <h3 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2 mb-3 sm:mb-4">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-romance-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                </svg>
                                Endereço
                            </h3>
                        </div>

                        {/* CEP */}
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                CEP
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="cep"
                                    value={formData.cep}
                                    onChange={handleChange}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/50 border-2 rounded-lg sm:rounded-xl transition-all duration-300 outline-none
                    ${errors.cep
                                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                        : 'border-gray-200 focus:border-romance-primary focus:ring-4 focus:ring-romance-primary/10'
                                    }
                    hover:border-romance-primary/50 placeholder:text-gray-400`}
                                    placeholder="00000-000"
                                    maxLength={9}
                                />
                                {loadingCEP && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <Loader />
                                    </div>
                                )}
                            </div>
                            {errors.cep && (
                                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600">{errors.cep}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">O endereço será preenchido automaticamente</p>
                        </div>

                        {/* Logradouro e Número */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                            <div className="sm:col-span-2">
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                    Logradouro
                                </label>
                                <input
                                    type="text"
                                    name="logradouro"
                                    value={formData.logradouro}
                                    onChange={handleChange}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/50 border-2 rounded-lg sm:rounded-xl transition-all duration-300 outline-none
                    ${errors.logradouro
                                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                        : 'border-gray-200 focus:border-romance-primary focus:ring-4 focus:ring-romance-primary/10'
                                    }
                    hover:border-romance-primary/50 placeholder:text-gray-400`}
                                    placeholder="Rua, Avenida..."
                                />
                                {errors.logradouro && (
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600">{errors.logradouro}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                    Número
                                </label>
                                <input
                                    type="text"
                                    name="numero"
                                    value={formData.numero}
                                    onChange={handleChange}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/50 border-2 rounded-lg sm:rounded-xl transition-all duration-300 outline-none
                    ${errors.numero
                                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                        : 'border-gray-200 focus:border-romance-primary focus:ring-4 focus:ring-romance-primary/10'
                                    }
                    hover:border-romance-primary/50 placeholder:text-gray-400`}
                                    placeholder="123"
                                />
                                {errors.numero && (
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600">{errors.numero}</p>
                                )}
                            </div>
                        </div>

                        {/* Complemento */}
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                Complemento <span className="text-gray-400 font-normal">(Opcional)</span>
                            </label>
                            <input
                                type="text"
                                name="complemento"
                                value={formData.complemento}
                                onChange={handleChange}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/50 border-2 border-gray-200 rounded-lg sm:rounded-xl transition-all duration-300 outline-none focus:border-romance-primary focus:ring-4 focus:ring-romance-primary/10 hover:border-romance-primary/50 placeholder:text-gray-400"
                                placeholder="Apto, Bloco, Casa..."
                            />
                        </div>

                        {/* Bairro, Cidade e Estado */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                    Bairro
                                </label>
                                <input
                                    type="text"
                                    name="bairro"
                                    value={formData.bairro}
                                    onChange={handleChange}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/50 border-2 rounded-lg sm:rounded-xl transition-all duration-300 outline-none
                    ${errors.bairro
                                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                        : 'border-gray-200 focus:border-romance-primary focus:ring-4 focus:ring-romance-primary/10'
                                    }
                    hover:border-romance-primary/50 placeholder:text-gray-400`}
                                    placeholder="Centro"
                                />
                                {errors.bairro && (
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600">{errors.bairro}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                    Cidade
                                </label>
                                <input
                                    type="text"
                                    name="cidade"
                                    value={formData.cidade}
                                    onChange={handleChange}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/50 border-2 rounded-lg sm:rounded-xl transition-all duration-300 outline-none
                    ${errors.cidade
                                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                        : 'border-gray-200 focus:border-romance-primary focus:ring-4 focus:ring-romance-primary/10'
                                    }
                    hover:border-romance-primary/50 placeholder:text-gray-400`}
                                    placeholder="São Paulo"
                                />
                                {errors.cidade && (
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600">{errors.cidade}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                    Estado
                                </label>
                                <select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/50 border-2 rounded-lg sm:rounded-xl transition-all duration-300 outline-none
                    ${errors.estado
                                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                                        : 'border-gray-200 focus:border-romance-primary focus:ring-4 focus:ring-romance-primary/10'
                                    }
                    hover:border-romance-primary/50`}
                                >
                                    <option value="">UF</option>
                                    {estados.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                </select>
                                {errors.estado && (
                                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600">{errors.estado}</p>
                                )}
                            </div>
                        </div>

                        {/* Consentimento LGPD */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border-2 border-purple-100">
                            <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="consentimento"
                                    checked={formData.consentimento}
                                    onChange={handleChange}
                                    className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 text-romance-primary border-gray-300 rounded focus:ring-romance-primary focus:ring-2 cursor-pointer transition-all flex-shrink-0"
                                />
                                <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Concordo em compartilhar meus dados pessoais com a Romance para fins de cadastro e contato comercial.
                  Li e aceito a{' '}
                                    <a href="/politica-privacidade" className="text-romance-primary hover:text-romance-dark font-semibold underline decoration-2 decoration-romance-primary/30 hover:decoration-romance-primary transition-all">
                    Política de Privacidade
                  </a>
                  .
                </span>
                            </label>
                            {errors.consentimento && (
                                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                    </svg>
                                    {errors.consentimento}
                                </p>
                            )}
                        </div>

                        {/* Status Messages */}
                        {submitStatus && (
                            <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 animate-fade-in ${
                                submitStatus.type === 'success'
                                    ? 'bg-green-50 border-2 border-green-200 text-green-800'
                                    : 'bg-red-50 border-2 border-red-200 text-red-800'
                            }`}>
                                {submitStatus.type === 'success' ? (
                                    <svg className="w-5h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                    </svg>
                                )}
                                <span className="font-medium text-xs sm:text-sm">{submitStatus.message}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full bg-gradient-to-r from-romance-primary to-romance-secondary hover:from-romance-dark hover:to-romance-primary text-white font-bold py-3 sm:py-3.5 md:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:shadow-romance-primary/50 transform hover:-translate-y-0.5 active:translate-y-0 group overflow-hidden text-sm sm:text-base"
                        >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                    <>
                        <Loader />
                        <span>Enviando...</span>
                    </>
                ) : (
                    <>
                        <span>Quero ser Consultora</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </>
                )}
              </span>

                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>

                        <p className="text-xs text-gray-500 text-center flex flex-wrap items-center justify-center gap-2 px-2">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                            </svg>
                            <span>Seus dados estão protegidos e serão usados apenas para contato comercial</span>
                        </p>
                    </form>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 items-center text-gray-600 px-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 backdrop-blur-sm bg-white/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                        </svg>
                        <span className="font-medium whitespace-nowrap">SSL Seguro</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 backdrop-blur-sm bg-white/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className="font-medium whitespace-nowrap">Conforme LGPD</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 backdrop-blur-sm bg-white/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/>
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/>
                        </svg>
                        <span className="font-medium whitespace-nowrap">Suporte 24/7</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 sm:mt-8 text-center space-y-1.5 sm:space-y-2 px-4">
                    <p className="text-xs sm:text-sm text-gray-600">
                        Avaliação 4.9/5 • Mais de 10.000 consultoras ativas
                    </p>
                    <p className="text-xs text-gray-500">
                        Romance Cosméticos LTDA | CNPJ: 36.425.096/0001-87
                    </p>
                </div>

            </div>
        </div>
    );
};

export default FormularioCadastro;