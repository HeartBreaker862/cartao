// script.js
console.log("[SCRIPT.JS] Script carregado e executando!");


document.addEventListener('DOMContentLoaded', () => {
    console.log("[SCRIPT.JS] DOMContentLoaded disparado!");

    const skipLoaderBtn = document.getElementById('skipLoaderBtn');
    // --- 1. DEFINIÇÕES DE FUNÇÕES AUXILIARES ---

    // Função para ajustar a altura do visor do loader (se o loader existir)
    function setVisorEffectiveHeight() {
        const helmetVisorForFunc = document.getElementById('helmet-visor'); // Pega dentro da função
        if (helmetVisorForFunc) {
            const visorHeight = helmetVisorForFunc.clientHeight;
            helmetVisorForFunc.style.setProperty('--visor-effective-height', `${visorHeight}px`);
        }
    }

    // Função para carregar partículas com tsParticles (se tsParticles estiver carregado)
    async function loadParticles(options) {
        if (typeof tsParticles === "undefined") {
            console.warn("tsParticles não está definido. Pulando carregamento de partículas.");
            return;
        }
        console.log("[LOADER] Tentando carregar partículas com opções:", JSON.stringify(options, null, 2));
        const existingContainer = tsParticles.domItem(0);
        if (existingContainer) {
            console.log("[LOADER] Container de partículas existente encontrado, destruindo...");
            existingContainer.destroy();
        }
        try {
            await tsParticles.load("tsparticles-background", options);
            console.log("[LOADER] Partículas carregadas com SUCESSO.");
        } catch (error) {
            console.error("[LOADER] ERRO ao carregar partículas:", error);
        }
    }
    
    // Função para atualizar a animação do loader
    function updateLoader() {
        // Pegar elementos do loader aqui para garantir que existem se a função for chamada
        const progressBarFillForLoader = document.getElementById('progress-bar-fill');
        const loadingPercentageTextForLoader = document.getElementById('loading-percentage');
        const loadingStatusTextForLoader = document.getElementById('loading-status-text');
        const bootTextsForLoader = document.querySelectorAll('.boot-sequence .boot-text');
        const loaderOverlayForLoader = document.getElementById('loader-overlay');


        // console.log("[LOADER] updateLoader INICIADA. Progress atual: " + currentProgress_loader);

        if (currentProgress_loader < 100) {
            currentProgress_loader += Math.floor(Math.random() * 2) + 1;
            if (currentProgress_loader > 100) {
                currentProgress_loader = 100;
            }
            // console.log("[LOADER] Dentro do IF (<100). Progress: " + currentProgress_loader);

            if (progressBarFillForLoader) progressBarFillForLoader.style.width = currentProgress_loader + '%';
            if (loadingPercentageTextForLoader) loadingPercentageTextForLoader.textContent = currentProgress_loader + '%';

            if (currentProgress_loader === 100) {
                if (progressBarFillForLoader) progressBarFillForLoader.classList.add('full');
                // console.log("[LOADER] Progress bar 100%");
            }

            const targetProgressForStatusChange = Math.floor((statusIndex_loader + 1) * (100 / statusMessages_loader.length));
            if (currentProgress_loader >= targetProgressForStatusChange && statusIndex_loader < statusMessages_loader.length -1) {
                if(statusMessages_loader[statusIndex_loader] && loadingStatusTextForLoader){
                    loadingStatusTextForLoader.textContent = statusMessages_loader[statusIndex_loader];
                }
                statusIndex_loader++;
            }

            const progressPerBootText = 100 / (bootTextsForLoader.length || 1);
            if (bootTextIndex_loader < bootTextsForLoader.length && currentProgress_loader >= (bootTextIndex_loader * progressPerBootText)) {
                 if (bootTextIndex_loader > 0 && bootTextsForLoader[bootTextIndex_loader - 1]) {
                    bootTextsForLoader[bootTextIndex_loader - 1].classList.remove('active');
                }
                if(bootTextsForLoader[bootTextIndex_loader]){
                    bootTextsForLoader[bootTextIndex_loader].classList.add('active');
                    bootTextIndex_loader++;
                }
            }
            setTimeout(updateLoader, Math.random() * 100 + 60);
        } else { 
            console.log("[LOADER] Bloco ELSE ALCANÇADO. Progress final: " + currentProgress_loader);
            if (progressBarFillForLoader) progressBarFillForLoader.style.width = '100%';
            if (progressBarFillForLoader) progressBarFillForLoader.classList.add('full');
            if (loadingPercentageTextForLoader) loadingPercentageTextForLoader.textContent = '100%';

            for (let i = 0; i < bootTextsForLoader.length; i++) {
                bootTextsForLoader[i].classList.remove('active');
            }
            if (bootTextsForLoader.length > 0 && bootTextsForLoader[bootTextsForLoader.length - 1]) {
                bootTextsForLoader[bootTextsForLoader.length - 1].classList.add('active');
            }
            if (loadingStatusTextForLoader) loadingStatusTextForLoader.textContent = "SEQUÊNCIA DE BOOT CONCLUÍDA.";
            
            setTimeout(() => {
                if (loaderOverlayForLoader) {
                    loaderOverlayForLoader.classList.add('hidden');
                    console.log("[LOADER] Classe 'hidden' ADICIONADA a #loader-overlay.");
                }
            }, 1200);
        }
    }

    // Funções da Página Principal (Catálogo)
    function applyModelSettings(itemElement) {
        const modelViewer_main = document.getElementById('mainModelViewer'); // Pegar aqui
        if (!modelViewer_main || !itemElement) return;
        // ... (resto da sua função applyModelSettings, use modelViewer_main) ...
        const itemName = itemElement.querySelector('.planet-thumb-name').textContent;
        let cameraOrbit = mainPageDefaultCameraOrbit; // Usar a constante global ao DOMContentLoaded
        let exposure = "1";
        let shadowIntensity = "1";
        let environmentImage = "neutral";

        if (itemName === "Shiba Inu") {
            cameraOrbit = "10deg 80deg 1.0m"; exposure = "1.4"; shadowIntensity = "1.3";
        } else if (itemName === "Terra") {
            cameraOrbit = "5deg 75deg 2.4m";
        } else if (itemName === "Marte") {
            cameraOrbit = "0deg 70deg 2.6m";  exposure = "0.9"; shadowIntensity = "0.7";
        } else if (itemName === "Saturno") {
            cameraOrbit = "20deg 85deg 4.2m"; exposure = "1.05"; shadowIntensity = "0.9";
        }

        modelViewer_main.cameraOrbit = cameraOrbit;
        modelViewer_main.exposure = exposure;
        modelViewer_main.shadowIntensity = shadowIntensity;
        modelViewer_main.environmentImage = environmentImage;
        modelViewer_main.cameraTarget = mainPageDefaultCameraTarget;
        console.log(`[MODEL_SETTINGS] ${itemName} - Orbit: ${cameraOrbit}`);

    }

    function updatePlanetDisplays(item, isInitialLoad = false) {
        const modelViewer_main = document.getElementById('mainModelViewer');
        const planetInfoContainer_main = document.getElementById('planetInfoContainer');
        const planetNameDisplay_main = document.getElementById('selectedPlanetName');
        const planetKeyFactDisplay_main = document.getElementById('selectedPlanetKeyFact');
        const planetDescriptionDisplay_main = document.getElementById('selectedPlanetDescription');
        const learnMorePlanetName_main = document.getElementById('learnMorePlanetName');


        if (!item) return;
        const name = item.querySelector('.planet-thumb-name').textContent;
        const keyFact = item.dataset.keyFact;
        const description = item.dataset.description;
        const glbSrc = item.dataset.glbSrc;
        const usdzSrc = item.dataset.usdzSrc;
        const altText = item.dataset.alt;

        const updateContent = () => {
            if (modelViewer_main) {
                modelViewer_main.src = glbSrc;
                modelViewer_main.iosSrc = usdzSrc || '';
                modelViewer_main.alt = altText || "Modelo 3D";
                applyModelSettings(item);
            }
            if(planetNameDisplay_main) planetNameDisplay_main.textContent = name;
            if(planetKeyFactDisplay_main) planetKeyFactDisplay_main.textContent = keyFact;
            if(planetDescriptionDisplay_main) planetDescriptionDisplay_main.textContent = description;
            if(learnMorePlanetName_main) learnMorePlanetName_main.textContent = name;
            if(planetInfoContainer_main) planetInfoContainer_main.classList.remove('fade-out');
        };

        if (isInitialLoad) {
            updateContent();
        } else {
            if(planetInfoContainer_main) planetInfoContainer_main.classList.add('fade-out');
            setTimeout(updateContent, 350);
        }
    }

    function setActiveItem(selectedIndex) {
        const catalogItems_main = Array.from(document.querySelectorAll('.catalog-item'));
        catalogItems_main.forEach((itm, idx) => {
            itm.classList.toggle('active', idx === selectedIndex);
        });
        if (catalogItems_main[selectedIndex]) {
            updatePlanetDisplays(catalogItems_main[selectedIndex]);
        }
        updateNavButtons();
    }

    function loadInitialPlanet() {
        const catalogItems_main = Array.from(document.querySelectorAll('.catalog-item'));
        const firstActiveItem = document.querySelector('.catalog-item.active');
        if (firstActiveItem) {
            currentPlanetIndex_main = catalogItems_main.indexOf(firstActiveItem);
        } else if (catalogItems_main.length > 0) {
            currentPlanetIndex_main = 0;
            if(catalogItems_main[0]) catalogItems_main[0].classList.add('active');
        }
        if (catalogItems_main.length > 0 && catalogItems_main[currentPlanetIndex_main]) {
            updatePlanetDisplays(catalogItems_main[currentPlanetIndex_main], true);
        }
        updateNavButtons();
    }
    
    function updateNavButtons() {
        const prevPlanetBtn_main = document.getElementById('prevPlanetBtn');
        const nextPlanetBtn_main = document.getElementById('nextPlanetBtn');
        if (prevPlanetBtn_main && nextPlanetBtn_main) {
            prevPlanetBtn_main.disabled = currentPlanetIndex_main === 0;
            nextPlanetBtn_main.disabled = currentPlanetIndex_main === Array.from(document.querySelectorAll('.catalog-item')).length - 1;
        }
    }


    // --- 2. CONSTANTES E VARIÁVEIS GLOBAIS AO DOMContentLoaded ---

    // Loader Vars
    const loaderOverlay = document.getElementById('loader-overlay');
    const helmetVisor = document.getElementById('helmet-visor'); // Definido aqui para setVisorEffectiveHeight
    let currentProgress_loader = 0;
    let bootTextIndex_loader = 0;
    const statusMessages_loader = [
        "INICIALIZANDO SISTEMAS...", "VERIFICANDO INTEGRIDADE...",
        "CONECTANDO À REDE ESTELAR...", "CARREGANDO PROTOCOLOS...",
        "PRONTO PARA EXPLORAÇÃO!"
    ];
    let statusIndex_loader = 0;

    // Main Page Vars
    const modelViewer_mainPage = document.getElementById('mainModelViewer'); // Renomeado para evitar conflito com o do modal
    const catalogItems_mainPage = Array.from(document.querySelectorAll('.catalog-item'));
    const planetInfoContainer_mainPage = document.getElementById('planetInfoContainer');
    // ... (demais constantes da página principal, renomeie se necessário para clareza)
    let currentPlanetIndex_main = 0;
    const mainPageDefaultCameraOrbit = modelViewer_mainPage ? modelViewer_mainPage.getAttribute('camera-orbit') || "0deg 75deg 2.5m" : "0deg 75deg 2.5m";
    const mainPageDefaultCameraTarget = "auto auto auto";


    // Fullscreen Modal Vars
    const fullscreenModelBtn = document.getElementById('fullscreenModelBtn');
    const fullscreenModal = document.getElementById('fullscreen-modal');
    const fullscreenModelContainer = document.getElementById('fullscreen-model-container');
    const closeFullscreenBtn = document.getElementById('closeFullscreenBtn');
    // Essas duas precisam ser preenchidas quando o modelViewer_mainPage existe e o botão é clicado
    let originalParentOfModelViewer = null;
    let originalModelViewerNextSibling = null;


    // --- 3. LÓGICA DE INICIALIZAÇÃO ---

    // Inicialização do Loader
    if (loaderOverlay) {
        console.log("[LOADER] #loader-overlay encontrado. Iniciando config de partículas e loader.");
        const debugParticlesOptions = { /* ... sua config de debug ou particlesOptionsEnteringSite ... */
             fpsLimit: 60, background: { color: "#0A0F1A" },
             particles: {
                 number: { value: 100 }, color: { value: "#FFFF00" },
                 shape: { type: "star", options: { star: { sides: 5 }}},
                 opacity: { value: 0.7 }, size: { value: {min: 1, max: 3} },
                 move: { enable: true, speed: 0.5, direction: "none", random: true, straight: false, outModes: { default: "out" }}
             },
             interactivity: { events: { onhover: { enable: false }, onclick: { enable: false }}}, detectRetina: true
        };
        let particlesOptionsToLoad = debugParticlesOptions;

        loadParticles(particlesOptionsToLoad)
            .then(() => {
                console.log("[LOADER] Promise de loadParticles resolvida.");
                if (typeof setVisorEffectiveHeight === "function") setVisorEffectiveHeight();
                if (typeof updateLoader === "function") updateLoader();
            })
            .catch(error => {
                console.error("[LOADER] Erro ao carregar/processar partículas:", error);
                if (typeof updateLoader === "function") {
                    console.warn("[LOADER] Erro nas partículas, mas tentando iniciar updateLoader.");
                    updateLoader();
                }
            });
        window.addEventListener('resize', setVisorEffectiveHeight);
    } else {
        console.warn("Elemento #loader-overlay não encontrado. Pulando loader.");
    }

    // Inicialização da Página Principal (Catálogo)
    if (modelViewer_mainPage) { // Verifica se o model viewer principal existe
        loadInitialPlanet();

        catalogItems_mainPage.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentPlanetIndex_main = index;
                setActiveItem(currentPlanetIndex_main);
            });
        });

        const toggleRotationBtn_main = document.getElementById('toggleRotationBtn');
        if (toggleRotationBtn_main) {
            toggleRotationBtn_main.addEventListener('click', () => {
                modelViewer_mainPage.autoRotate = !modelViewer_mainPage.autoRotate;
                toggleRotationBtn_main.innerHTML = modelViewer_mainPage.autoRotate ? '<i class="fas fa-pause"></i> Pausar Rotação' : '<i class="fas fa-play"></i> Iniciar Rotação';
            });
        }

        const resetCameraBtn_main = document.getElementById('resetCameraBtn');
        if (resetCameraBtn_main) {
            resetCameraBtn_main.addEventListener('click', () => {
                if (catalogItems_mainPage[currentPlanetIndex_main]) {
                    applyModelSettings(catalogItems_mainPage[currentPlanetIndex_main]);
                }
            });
        }

        const prevPlanetBtn_main = document.getElementById('prevPlanetBtn');
        const nextPlanetBtn_main = document.getElementById('nextPlanetBtn');
        if (prevPlanetBtn_main) {
            prevPlanetBtn_main.addEventListener('click', () => {
                if (currentPlanetIndex_main > 0) {
                    currentPlanetIndex_main--;
                    setActiveItem(currentPlanetIndex_main);
                }
            });
        }
        if (nextPlanetBtn_main) {
            nextPlanetBtn_main.addEventListener('click', () => {
                if (currentPlanetIndex_main < catalogItems_mainPage.length - 1) {
                    currentPlanetIndex_main++;
                    setActiveItem(currentPlanetIndex_main);
                }
            });
        }
        
        const learnMoreBtn_main = document.getElementById('learnMoreBtn');
        if (learnMoreBtn_main) {
            learnMoreBtn_main.addEventListener('click', (e) => {
                e.preventDefault();
                const planetNameDisplay_main = document.getElementById('selectedPlanetName');
                if(planetNameDisplay_main) alert(`Saiba mais sobre ${planetNameDisplay_main.textContent}!`);
            });
        }
    } else {
        console.warn("Elemento #mainModelViewer não encontrado. Funcionalidades do catálogo desabilitadas.");
    }

    // Inicialização da Funcionalidade de Tela Cheia
    if (fullscreenModelBtn && modelViewer_mainPage && fullscreenModal && fullscreenModelContainer && closeFullscreenBtn) {
        // Captura o pai original e o próximo irmão AQUI, onde modelViewer_mainPage está garantido
        originalParentOfModelViewer = modelViewer_mainPage.parentElement;
        originalModelViewerNextSibling = modelViewer_mainPage.nextSibling;

        fullscreenModelBtn.addEventListener('click', () => {
            console.log("[FULLSCREEN] Botão de tela cheia clicado.");
            fullscreenModelContainer.appendChild(modelViewer_mainPage); // Usa a instância correta
            fullscreenModal.classList.add('visible');
            document.body.style.overflow = 'hidden';
            
            if (typeof modelViewer_mainPage.requestUpdate === 'function') {
                modelViewer_mainPage.requestUpdate();
            }
            void modelViewer_mainPage.offsetWidth;
        });

        const closeFS = () => {
            console.log("[FULLSCREEN] Fechando tela cheia.");
            if (originalParentOfModelViewer) {
                if(originalModelViewerNextSibling) {
                    originalParentOfModelViewer.insertBefore(modelViewer_mainPage, originalModelViewerNextSibling);
                } else {
                    originalParentOfModelViewer.appendChild(modelViewer_mainPage);
                }
            }
            fullscreenModal.classList.remove('visible');
            document.body.style.overflow = '';
            if (typeof modelViewer_mainPage.requestUpdate === 'function') {
                modelViewer_mainPage.requestUpdate();
            }
            void modelViewer_mainPage.offsetWidth;
        };

        closeFullscreenBtn.addEventListener('click', closeFS);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && fullscreenModal.classList.contains('visible')) {
                closeFS();
            }
        });
    } else {
        console.warn("Elementos para a funcionalidade de tela cheia do modelo não encontrados.");
    }
});