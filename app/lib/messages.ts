export const MESSAGES = {
  // Geral
  generic: {
    error: "Algo deu errado. Tente novamente.",
    success: "Operação realizada com sucesso.",
    notFound: "Não encontrado.",
    accessDenied: "Acesso negado.",
    loading: "Carregando...",
    saving: "Salvando...",
  },

  // Auth / Perfil
  auth: {
    registerSuccess: "Cadastro realizado com sucesso.",
    registerError: "Erro ao cadastrar usuário.",
    requiredFields: "Todos os campos são obrigatórios.",
  },
  profile: {
    updated: "Perfil atualizado com sucesso.",
    updateError: "Erro ao atualizar perfil.",
    nameRequired: "Nome é obrigatório.",
    invalidPhone: "Telefone inválido.",
  },

  // Prazos
  deadlines: {
    created: "Prazo criado com sucesso.",
    createError: "Erro ao criar prazo.",
    updated: "Prazo atualizado com sucesso.",
    updateError: "Erro ao atualizar prazo.",
    deleted: "Prazo excluído com sucesso.",
    deleteError: "Erro ao excluir prazo.",
    notFound: "Prazo não encontrado.",
    accessDenied: "Acesso negado a este prazo.",
    titleRequired: "Título é obrigatório.",
    dateRequired: "Data é obrigatória.",
    typeRequired: "Tipo é obrigatório.",
    processNumberRequired: "Número do processo é obrigatório.",
    invalidDate: "Data inválida.",
    syncSuccess: "Prazo sincronizado com o calendário.",
    syncError: "Erro ao sincronizar com o calendário.",
    processRefreshed: "Andamentos atualizados.",
    processAlreadyUpdated: "Dados já estavam atualizados.",
    processRefreshError: "Erro ao atualizar andamentos.",
  },

  // Calendário
  calendar: {
    connected: (provider: string) => `${provider} conectado com sucesso.`,
    connectError: (provider: string) =>
      `Erro ao conectar com ${provider}. Tente novamente.`,
    disconnected: (provider: string) => `${provider} desconectado.`,
    disconnectError: (provider: string) =>
      `Erro ao desconectar ${provider}.`,
  },

  // Notificações / Push
  notifications: {
    preferencesSaved: "Preferências salvas com sucesso.",
    preferencesError: "Erro ao salvar preferências.",
    pushEnabled: "Notificações push ativadas.",
    pushDisabled: "Notificações push desativadas.",
    pushEnableError: "Erro ao ativar notificações push.",
    pushDisableError: "Erro ao desativar notificações push.",
    vapidKeyMissing: "Chave VAPID pública não configurada.",
    serviceWorkerNotSupported: "Service worker não suportado neste navegador.",
    notificationPermissionDenied: "Permissão de notificação negada.",
    pushSubscriptionError: "Falha ao salvar inscrição de push.",
  },
} as const;

export type MessageKey = keyof typeof MESSAGES;
