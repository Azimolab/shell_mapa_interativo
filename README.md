# Shell Interactive Map - Mapa Interativo Shell Brasil

Aplicação web interativa para visualização do portfólio Shell Brasil, mostrando exploração e produção de petróleo e gás em águas profundas (pré-sal).

## 📋 Características

### Hierarquia Exata do Figma

A aplicação segue fielmente a hierarquia definida no design do Figma:

1. **4 Zonas Geográficas**
   - Barreirinhas
   - Potiguar
   - Rio
   - Pelotas

2. **3 Tipos de Pins por Zona**
   - **Em Exploração** (vermelho) - Blocos marítimos em fase de exploração
   - **Em Produção** (verde) - Blocos marítimos em produção ativa
   - **Em Descomissionamento** (cinza) - Blocos em processo de desativação

3. **Timeline de Anos**
   - PRÉ 2013 até 2025
   - Possibilidade de reprodução automática
   - Controle de velocidade (0.5x, 1x, 1.5x, 2x)

4. **Infraestrutura**
   - Oleodutos (laranja)
   - Gasodutos (azul escuro)
   - Infraestrutura de terceiros (linha tracejada)

5. **Localizações Especiais**
   - Headquarters (Rio de Janeiro)
   - Filiais (São Paulo, Macaé)

## 🚀 Tecnologias

- **React 19** - Framework JavaScript
- **Vite** - Build tool e dev server
- **CSS Modules** - Estilização modular
- **SVG** - Renderização do mapa e elementos gráficos

## 📁 Estrutura do Projeto

```
shell-mapa/
├── src/
│   ├── components/
│   │   ├── Map.jsx              # Componente principal do mapa
│   │   ├── Map.css
│   │   ├── Pin.jsx              # Componente de pins (marcadores)
│   │   ├── Pin.css
│   │   ├── LocationMarker.jsx   # Marcadores de localização
│   │   ├── LocationMarker.css
│   │   ├── Timeline.jsx         # Controles de timeline
│   │   ├── Timeline.css
│   │   ├── Toolbar.jsx          # Toolbar lateral (controles)
│   │   └── Toolbar.css
│   ├── data/
│   │   └── mapData.js           # Estrutura de dados (zonas, pins, anos)
│   ├── App.jsx                  # Componente raiz da aplicação
│   ├── App.css                  # Estilos globais
│   ├── main.jsx                 # Entry point
│   └── index.css                # Reset CSS
├── public/
├── index.html
├── package.json
└── README.md
```

## 🎨 Sistema de Cores

Seguindo o design Shell:

- **Shell Red**: `#dd1d21` - Pins de exploração
- **Shell Yellow**: `#fbce07` - Logo Shell
- **Forest Green**: `#008557` - Pins de produção
- **Sky Blue**: `#027fa2` - Elementos interativos
- **Sunrise Orange**: `#ed8a00` - Oleodutos
- **Ocean Blue**: `#c0e6ec` - Background

## 💻 Comandos

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

## 🎮 Uso

### Navegação por Zonas
1. Use os botões no toolbar à direita para selecionar entre as 4 zonas
2. O mapa automaticamente centraliza na zona selecionada

### Timeline de Anos
1. Clique em qualquer ano na timeline inferior para visualizar dados daquele período
2. Use o botão de play para reprodução automática
3. Ajuste a velocidade com o botão de velocidade (0.5x - 2x)

### Controle de Visibilidade
1. No toolbar à direita, clique nos ícones de olho para mostrar/ocultar:
   - Pins de exploração
   - Pins de produção
   - Pins de descomissionamento

### Interação com Pins
- Clique em qualquer pin para ver detalhes (funcionalidade expansível)
- Pins com números indicam clusters (agrupamento de múltiplos blocos)

## 📊 Estrutura de Dados

Os dados são organizados hierarquicamente em `src/data/mapData.js`:

```javascript
{
  [ZONA]: {
    [ANO]: {
      [TIPO_DE_PIN]: [
        { id, name, lat, lng, ... }
      ]
    }
  }
}
```

Para adicionar novos dados, basta seguir esta estrutura no arquivo `mapData.js`.

## 🎯 Funcionalidades Futuras

- [ ] Detalhes expandidos ao clicar em pins
- [ ] Filtros adicionais por operador, profundidade
- [ ] Exportação de dados visualizados
- [ ] Modo de comparação entre anos
- [ ] Animações de transição mais suaves
- [ ] Suporte multilíngue (PT, EN, ES)

## 🌐 Responsividade

A aplicação é totalmente responsiva e se adapta a diferentes tamanhos de tela:
- Desktop (1920px+)
- Laptop (1440px)
- Tablet (1024px)
- Mobile (768px-)

## 📝 Licença

Este projeto foi desenvolvido para a Shell Brasil.

## 👥 Contribuição

Para contribuir com o projeto:
1. Mantenha a hierarquia de dados definida
2. Siga os padrões de código existentes
3. Teste em diferentes resoluções
4. Documente mudanças significativas

---

Desenvolvido com ❤️ seguindo as especificações do Figma
