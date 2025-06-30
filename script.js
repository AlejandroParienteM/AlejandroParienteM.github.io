// Matrix Love - Mensajes románticos cayendo como lluvia
class MatrixLove {
    constructor() {
        this.canvas = document.getElementById('matrix');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = true;
        this.speed = 1; // Velocidad un poco más rápida
        this.colorMode = 2; // Arcoíris por defecto
        this.columns = [];
        this.fontSize = 36;
        this.ripples = []; // Array para las ondas de click
        
        // Mensajes románticos predefinidos sin emojis
        this.loveMessages = [
            "Te amo", "Eres mi vida", "Bella", "Mi amor",
            "Juntos", "Hermosa", "Corazón", "Estrella",
            "Perfecta", "Abracito", "Mapirosa", "Luna",
            "AMORCITOOOO", "Flores", "Dulzura", "Princesa",
            "Te quiero", "Eres única", "Mi tesoro", "Muchos besitos",
            "Mi cielo", "Bonita", "Preciosa", "Dulce amor",
            "Mi vida", "Cariño", "Amor mío", "Mi todo",
            "Leoncito", "Ternura", "Belleza", "Besitos",
            "Chiquita", "Aliss", "Brillo", "Eterno",
            "Bonita", "Gerberas", "Hilo Rojo", "Reina",
            "Drolicoco", "Mapirosa", "Amor", "Destino",
            "Radiante", "Amorcito", "Frutilla", "Reina",
            "Luz", "Encantadora", "Mapirosa", "Adorable",
            "Espléndida", "Maravillosa", "Jhenisse", "Fascinante",
            "Cautivadora", "Inteligente", "Aliss", "Dulce",
            "Tierna", "Delicada", "Elegante", "Graciosa",
            "Alisson", "Preciosa", "Única", "Especial",
            "Extraordinaria", "Perfecta", "Jhenisse","Aliss","Jheni<3", "Magnífica","Para siempre"
        ];
        
        this.allMessages = [...this.loveMessages];
        
        this.init();
        this.setupEventListeners();
        this.setupClickHandler();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createColumns();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createColumns();
    }
    
    createColumns() {
        const numColumns = Math.floor(this.canvas.width / (this.fontSize * 6)); // Mucho más espaciado
        this.columns = [];
        
        for (let i = 0; i < numColumns; i++) {
            this.columns.push({
                x: i * this.fontSize * 6 + Math.random() * 50, // Mucho más espacio entre columnas
                y: -Math.random() * this.canvas.height * 0.8 - 100, // Escalonamiento suave
                message: this.getRandomMessage(),
                messageIndex: 0,
                speed: Math.random() * 1.2 + 0.6, // Velocidad más lenta y relajada
                opacity: Math.random() * 0.1 + 0.9, // Muy opaco para claridad
                lastCharTime: 0,
                charDelay: Math.random() * 180 + 140 // Delay más largo para lectura
            });
        }
    }
    
    getRandomMessage() {
        return this.allMessages[Math.floor(Math.random() * this.allMessages.length)];
    }
    
    createRipple(x, y) {
        // Crear múltiples mensajes que se expanden en círculo
        const numMessages = 8; // Número de mensajes en la onda
        const ripple = {
            x: x,
            y: y,
            messages: [],
            startTime: Date.now(),
            duration: 3000 // Duración de la onda en ms
        };
        
        // Crear mensajes que se expanden en todas las direcciones
        for (let i = 0; i < numMessages; i++) {
            const angle = (i / numMessages) * Math.PI * 2; // Distribuir en círculo
            const speed = Math.random() * 100 + 50; // Velocidad de expansión
            
            ripple.messages.push({
                message: this.getRandomMessage(),
                angle: angle,
                speed: speed,
                distance: 0,
                opacity: 1,
                size: this.fontSize
            });
        }
        
        this.ripples.push(ripple);
    }
    
    setupClickHandler() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.createRipple(x, y);
        });
        
        // También para touch en móviles
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.createRipple(x, y);
        });
    }
    
    getColor(opacity, columnIndex) {
        const colors = [
            `rgba(0, 255, 65, ${opacity})`,     // Verde clásico Matrix
            `rgba(255, 105, 180, ${opacity})`,  // Rosa romántico
            `hsl(${(columnIndex * 30 + Date.now() * 0.1) % 360}, 70%, 60%)`, // Arcoíris
            `rgba(100, 200, 255, ${opacity})`   // Azul suave
        ];
        
        return colors[this.colorMode];
    }
    
    drawMessage(column, currentTime) {
        const { x, y, message, messageIndex, speed, opacity, lastCharTime, charDelay } = column;
        
        // Actualizar posición
        column.y += speed * this.speed;
        
        // Reset cuando salga de pantalla con ritmo más relajado
        if (column.y > this.canvas.height + this.fontSize * 3) {
            column.y = -this.fontSize * 10 - Math.random() * 200;
            column.message = this.getRandomMessage();
            column.messageIndex = 0;
            column.speed = Math.random() * 1.2 + 0.6;
            column.opacity = Math.random() * 0.1 + 0.9;
        }
        
        // Mostrar caracteres progresivamente más rápido
        if (currentTime - lastCharTime > charDelay * 0.3) {
            if (messageIndex < message.length) {
                column.messageIndex++;
            } else {
                // Reiniciar inmediatamente
                column.messageIndex = 0;
                column.message = this.getRandomMessage();
            }
            column.lastCharTime = currentTime;
        }
        
        // Dibujar mensajes completos horizontalmente con estela vertical
        const trails = 18; // Columnas súper largas
        
        // Mostrar mensaje completo cuando esté listo
        const visibleMessage = message.slice(0, messageIndex);
        
        if (visibleMessage.length > 0) {
            for (let i = 0; i < trails; i++) {
                const trailY = y - (i * this.fontSize * 1.4); // Espaciado para columnas súper largas
                
                if (trailY > 0 && trailY < this.canvas.height) {
                    // Calcular opacidad: el mensaje principal más brillante
                    let trailOpacity;
                    if (i === 0) {
                        trailOpacity = opacity; // Mensaje principal (más brillante)
                    } else {
                        trailOpacity = Math.max(0, opacity * (1 - i * 0.06)); // Desvanecimiento gradual para columnas largas
                    }
                    
                    this.ctx.fillStyle = this.getColor(trailOpacity, this.columns.indexOf(column));
                    
                    // Sin efectos de luz ni sombra
                    this.ctx.shadowBlur = 0;
                    this.ctx.shadowColor = 'transparent';
                    
                    // Dibujar mensaje completo horizontalmente
                    this.ctx.fillText(visibleMessage, x, trailY);
                }
            }
        }
    }
    
    drawRipples(currentTime) {
        // Dibujar todas las ondas activas
        this.ripples = this.ripples.filter(ripple => {
            const elapsed = currentTime - ripple.startTime;
            const progress = elapsed / ripple.duration;
            
            // Si la onda ya terminó, no la dibujamos más
            if (progress >= 1) {
                return false;
            }
            
            // Dibujar cada mensaje de la onda
            ripple.messages.forEach(msg => {
                // Actualizar distancia y opacidad
                msg.distance += msg.speed * 0.016; // ~60fps
                msg.opacity = Math.max(0, 1 - progress);
                msg.size = this.fontSize + (progress * 20); // Crecer ligeramente
                
                // Calcular posición
                const x = ripple.x + Math.cos(msg.angle) * msg.distance;
                const y = ripple.y + Math.sin(msg.angle) * msg.distance;
                
                // Solo dibujar si está en pantalla
                if (x > -100 && x < this.canvas.width + 100 && 
                    y > -100 && y < this.canvas.height + 100) {
                    
                    // Configurar estilo
                    this.ctx.font = `${msg.size}px "Courier New", monospace`;
                    this.ctx.fillStyle = this.getColor(msg.opacity, 0);
                    
                    // Efecto de brillo para las ondas
                    this.ctx.shadowBlur = 15 * msg.opacity;
                    this.ctx.shadowColor = this.getColor(msg.opacity * 0.8, 0);
                    
                    // Dibujar mensaje
                    this.ctx.fillText(msg.message, x, y);
                    
                    // Limpiar sombra
                    this.ctx.shadowBlur = 0;
                    this.ctx.shadowColor = 'transparent';
                }
            });
            
            return true; // Mantener la onda
        });
    }
    
    animate() {
        if (!this.isRunning) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        // Fondo con efecto de desvanecimiento más lento
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Configurar fuente
        this.ctx.font = `${this.fontSize}px "Courier New", monospace`;
        this.ctx.textAlign = 'left';
        
        const currentTime = Date.now();
        
        // Dibujar todas las columnas
        this.columns.forEach(column => {
            this.drawMessage(column, currentTime);
        });
        
        // Dibujar las ondas de click
        this.drawRipples(currentTime);
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupEventListeners() {
        // Atajos de teclado simplificados
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.isRunning = !this.isRunning;
                    break;
                case 's':
                case 'S':
                    this.speed = this.speed === 0.5 ? 1 : this.speed === 1 ? 2 : 0.5;
                    break;
                case 'c':
                case 'C':
                    this.colorMode = (this.colorMode + 1) % 4;
                    break;
                case 'f':
                case 'F':
                    if (!e.ctrlKey) {
                        if (!document.fullscreenElement) {
                            document.documentElement.requestFullscreen();
                        } else {
                            document.exitFullscreen();
                        }
                    }
                    break;
            }
        });
    }
}

// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    new MatrixLove();
    
    // Matrix Love iniciado - versión simplificada
    console.log('💚 Matrix Love iniciado - Color arcoíris');
    console.log('Atajos: ESPACIO=pausa, S=velocidad, C=color, F=pantalla completa');
}); 
