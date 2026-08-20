import { ref, computed } from 'vue'

export type Lang = 'es' | 'en'
const LANG_STORAGE_KEY = 'omnistudio_lang_pref'

const currentLang = ref<Lang>((localStorage.getItem(LANG_STORAGE_KEY) as Lang) || 'es')

export const useLanguage = () => {
  const toggleLang = () => {
    currentLang.value = currentLang.value === 'es' ? 'en' : 'es'
    localStorage.setItem(LANG_STORAGE_KEY, currentLang.value)
  }

  const t = computed(() => {
    if (currentLang.value === 'en') {
      return {
        // Header & Sidebar
        searchPlaceholder: 'Search by keyword in variants...',
        navStudio: 'Creative Studio',
        navEngines: 'Engines & Formats',
        navSupport: 'Support & API',
        pipelineVersion: 'Omni Pipeline v2.4',
        pipelineStatus: 'Active Engine',
        configuredVariants: '5 variants configured',

        // Footer
        footerCopyright: '© 2026 OmniStudio AI. High-performance omnichannel content generation.',
        footerPrivacy: 'Privacy Policy',
        footerTerms: 'Terms of Service',
        footerStatus: 'Systems Operational',

        // HomeView
        headerTitle: 'Content Intelligence Hub',
        headerSubtitle: 'Configure tone, audience, and language to generate 5-channel AI variants.',
        approvedCount: 'Approved',
        scheduleBtn: 'Schedule',
        schedulingBtn: 'Scheduling...',
        toneLabel: '🎭 Editorial Tone',
        audienceLabel: '🎯 Target Audience',
        languageLabel: '🌐 Output Language',
        placeholder: 'Write your core premise or news headline here...',
        helperText: 'Generate 5 variants at once or regenerate cards individually.',
        generateBtn: 'Generate Omnichannel Variants',
        generatingBtn: 'Processing in n8n...',
        allFilter: 'All',
        approvedBadge: 'Approved',
        editBtn: 'Edit',
        approveBtn: 'Approve for Publishing',
        unapproveBtn: 'Disapprove',
        emptyTitle: 'No matching variants found',
        emptySubtitle: 'Select the "All" category to view your content.',
        modalTitle: 'Omnichannel Content Editor',
        inputTitleLabel: 'Headline / Main Hook',
        inputContentLabel: 'Body Content / Script',
        wordsText: 'words',
        charsText: 'characters',
        discardBtn: 'Discard Changes',
        saveBtn: 'Save Changes',
        exportBtn: 'Export Content',
        exportMd: 'Markdown (.md)',
        exportJson: 'JSON (.json)',
        exportTxt: 'Plain Text (.txt)',
        regenerateTitle: 'Regenerate this variant only',
        syncSuccess: 'pieces scheduled in Google Calendar & Supabase!',
        syncError: 'Error connecting to scheduling workflow.',

        // Select Options & Badges
        tones: {
          viral: 'Direct & Viral',
          b2b: 'Corporate B2B',
          story: 'Emotional Storytelling',
          tech: 'Technical & Analytical'
        },
        audiences: {
          creators: 'Creators & Entrepreneurs',
          devs: 'Developers & Tech',
          execs: 'B2B Executives',
          general: 'General Audience'
        },
        languages: {
          es: 'Spanish',
          en: 'English'
        },
        formats: {
          all: 'All',
          threads: 'Threads',
          articles: 'Articles',
          newsletters: 'Newsletters',
          videos: 'Videos',
          audios: 'Audios'
        },

        // ServicesView (Motores & Formatos)
        servicesTitle: 'Omnichannel Engines & Formats',
        servicesSubtitle: 'Explore output channels and technical capabilities powered by our n8n cluster.',
        activeBadge: 'Active Pipeline',
        threadsDesc: 'Optimized hooks, thread atomization, and viral punchlines for X.',
        articlesDesc: 'In-depth thought leadership articles ready for Blog & Medium distribution.',
        newslettersDesc: 'High-conversion editorial layouts formatted for Substack and Beehiiv.',
        videosDesc: 'Short-form visual scripts with timing markers for Reels and YouTube Shorts.',
        audiosDesc: 'Podcast and voiceover outlines structured for engaging audio retention.',

        // ContactView (Soporte & API)
        contactTitle: 'Support & Webhook Hub',
        contactSubtitle: 'Send a direct inquiry or test omnichannel alerting (Discord, Telegram & Gmail).',
        formName: 'Your Name',
        formEmail: 'Email Address',
        formChannel: 'Target Channel',
        formMessage: 'Message or Custom Payload',
        formSubmit: 'Send Notification',
        formSending: 'Dispatching...',
        formSuccess: 'Notification dispatched across all configured channels!',
        formError: 'Failed to dispatch notification. Verify n8n webhook.'
      }
    }

    // Español por defecto
    return {
      searchPlaceholder: 'Buscar por palabras clave en variantes...',
      navStudio: 'Estudio Creativo',
      navEngines: 'Motores & Formatos',
      navSupport: 'Soporte & API',
      pipelineVersion: 'Omni Pipeline v2.4',
      pipelineStatus: 'Motor Activo',
      configuredVariants: '5 variantes configuradas',

      footerCopyright: '© 2026 OmniStudio AI. Generación y atomización de contenido de alto rendimiento.',
      footerPrivacy: 'Privacidad',
      footerTerms: 'Términos de Servicio',
      footerStatus: 'Sistemas Operativos',

      headerTitle: 'Central de Inteligencia de Contenido',
      headerSubtitle: 'Configura tono, audiencia e idioma para estructurar tus variantes omnicanal con IA.',
      approvedCount: 'Aprobados',
      scheduleBtn: 'Programar',
      schedulingBtn: 'Sincronizando...',
      toneLabel: '🎭 Tono Editorial',
      audienceLabel: '🎯 Audiencia Objetivo',
      languageLabel: '🌐 Idioma de Salida',
      placeholder: 'Escribe aquí tu premisa o noticia...',
      helperText: 'Genera 5 variantes simultáneas o regenera tarjetas individualmente.',
      generateBtn: 'Generar Variantes Omnicanal',
      generatingBtn: 'Procesando en n8n...',
      allFilter: 'Todos',
      approvedBadge: 'Aprobado',
      editBtn: 'Editar',
      approveBtn: 'Aprobar para Publicar',
      unapproveBtn: 'Desaprobar',
      emptyTitle: 'No se encontraron variantes coincidentes',
      emptySubtitle: 'Selecciona la categoría "Todos" para visualizarlas.',
      modalTitle: 'Editor de Pieza Omnicanal',
      inputTitleLabel: 'Título / Gancho Principal',
      inputContentLabel: 'Cuerpo del Contenido / Guion',
      wordsText: 'palabras',
      charsText: 'caracteres',
      discardBtn: 'Descartar Cambios',
      saveBtn: 'Guardar Edición',
      exportBtn: 'Exportar Contenido',
      exportMd: 'Markdown (.md)',
      exportJson: 'JSON (.json)',
      exportTxt: 'Texto Plano (.txt)',
      regenerateTitle: 'Regenerar solo esta variante',
      syncSuccess: 'piezas agendadas en Calendar y guardadas en Supabase!',
      syncError: 'Error al conectar con el flujo de agendamiento.',

      tones: {
        viral: 'Directo & Viral',
        b2b: 'Corporativo B2B',
        story: 'Storytelling Emocional',
        tech: 'Técnico & Analítico'
      },
      audiences: {
        creators: 'Creadores & Emprendedores',
        devs: 'Desarrolladores & Tech',
        execs: 'Ejecutivos B2B',
        general: 'Audiencia General'
      },
      languages: {
        es: 'Español',
        en: 'Inglés'
      },
      formats: {
        all: 'Todos',
        threads: 'Hilos',
        articles: 'Artículos',
        newsletters: 'Boletines',
        videos: 'Videos',
        audios: 'Audios'
      },

      servicesTitle: 'Motores y Formatos Omnicanal',
      servicesSubtitle: 'Conoce las capacidades técnicas y canales de salida procesados por nuestro clúster n8n.',
      activeBadge: 'Pipeline Activo',
      threadsDesc: 'Ganchos optimizados, atomización en hilos y remates de alto impacto para X.',
      articlesDesc: 'Artículos editoriales profundos listos para su distribución en Blogs y Medium.',
      newslettersDesc: 'Estructuras informativas de alta conversión diseñadas para Substack y Beehiiv.',
      videosDesc: 'Guiones audiovisuales con marcas de tiempo para Shorts, Reels y TikTok.',
      audiosDesc: 'Estructuras de episodios de podcast diseñadas para maximizar la retención auditiva.',

      contactTitle: 'Soporte y Central de Webhooks',
      contactSubtitle: 'Envía una solicitud directa o prueba la integración de alertas (Discord, Telegram y Gmail).',
      formName: 'Tu Nombre',
      formEmail: 'Correo Electrónico',
      formChannel: 'Canal de Interés',
      formMessage: 'Mensaje o Payload Personalizado',
      formSubmit: 'Enviar Notificación',
      formSending: 'Despachando...',
      formSuccess: '¡Notificación enviada con éxito a todos los canales configurados!',
      formError: 'Error al enviar la notificación. Verifica el webhook de n8n.'
    }
  })

  return {
    currentLang,
    toggleLang,
    t
  }
}