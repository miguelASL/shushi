# Contador de Sushi 🍣

Aplicación web interactiva para contar sushi con múltiples modos de juego.

## Estructura del Proyecto

```
contador-sushi/
├── index.html          # Archivo HTML principal
├── css/
│   └── styles.css     # Estilos y animaciones CSS
├── js/
│   └── app.js         # Lógica de la aplicación React
└── README.md          # Este archivo
```

## Características

- 🍣 **Modo Solo**: Cuenta sushi individualmente con selección de tipo
- ⚔️ **Modo Batalla**: Compite con otro jugador
- 📊 **Estadísticas**: Revisa tus récords y logros
- 🎨 **8 tipos de sushi**: Diferentes variedades con estilo toon 3D
- 🔊 **Sonidos**: Efectos de sonido para cada acción
- 🎉 **Animaciones**: Confetti y efectos visuales al completar

## Cómo usar

### Opción 1: Servidor Local (Recomendado)

Para que funcione correctamente con archivos externos, necesitas un servidor web local:

```bash
# Con Python 3
python -m http.server 8000

Luego abre en el navegador: `http://localhost:8000`

### Opción 2: Abrir directamente

Puedes abrir `index.html` directamente en el navegador, pero algunas funcionalidades pueden no funcionar debido a las restricciones CORS de los navegadores modernos.

## Tecnologías Utilizadas

- **React 18**: Framework de JavaScript para la interfaz
- **Tailwind CSS**: Framework de estilos CSS
- **Babel Standalone**: Transpilador de JavaScript en el navegador
- **Web Audio API**: Para generar sonidos dinámicamente
- **LocalStorage**: Para guardar estadísticas

## Modos de Juego

### Modo Solo
- Selecciona tu tipo de sushi favorito
- Cuenta cada pieza que comes
- Termina cuando estés lleno
- Revisa tus resultados con confetti y sonidos

### Modo Batalla
- Dos jugadores compiten
- Cada uno elige su sushi y nombre personalizado
- El que coma más gana
- Pantalla de resultados animada

### Estadísticas
- Total de sushi comido
- Número de batallas
- Mejor récord en modo solo

## Desarrollo

El proyecto está organizado en:
- **HTML**: Estructura básica y carga de dependencias
- **CSS**: Todas las animaciones y estilos personalizados
- **JavaScript**: Toda la lógica de la aplicación React

Para modificar el código, edita los archivos correspondientes en sus carpetas.
