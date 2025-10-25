# PopoverPins

Componente React para exibição de informações detalhadas sobre pins/campos de exploração, baseado no design do Figma Shell Library.

## 🎨 Design

Este componente foi criado com base no design do Figma:
- **Fonte**: Shell Library
- **Node ID**: 1:414
- **Link**: [Figma Design](https://www.figma.com/design/QstgoMsgyKyiltrQhAjdI3/ShellLibrary?node-id=1-414)

## 📦 Características

- ✅ Design fiel ao Figma
- ✅ Totalmente responsivo
- ✅ Usa fontes Shell personalizadas
- ✅ Animações suaves de entrada/saída
- ✅ Portal para renderização em nível de documento
- ✅ Fechamento ao clicar fora do popover
- ✅ Suporte a barras de progresso para participação de empresas
- ✅ Seção de infraestrutura com bullets customizados

## 🚀 Uso Básico

```jsx
import React, { useState } from 'react';
import PopoverPins from './components/popovers/PopoverPins';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const data = {
    status: "Em descomissionamento",
    title: "BM-S-11A - Iara",
    tags: ["Berbigão", "Sururu", "Oeste de Atapú"],
    operator: "Shell",
    operatorDescription: "Responsável pela administração do campo",
    depth: "~400-870m",
    depthDescription: "Distância da superfície do mar até o fundo",
    companies: [
      {
        name: "Shell",
        percentage: 40,
        isOperator: true
      },
      {
        name: "Chevron",
        percentage: 35,
        isOperator: false
      }
    ],
    infrastructure: "2 FPSOs em operação",
    infrastructureDescription: "Unidade flutuante de produção, armazenamento e transferência de petróleo",
    infrastructureItems: ["P68", "P70"]
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Abrir Detalhes
      </button>
      
      <PopoverPins
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        data={data}
      />
    </>
  );
}
```

## 📋 Props

### `isOpen` (boolean) - Obrigatório
Controla a visibilidade do popover.

### `onClose` (function) - Obrigatório
Callback chamado quando o usuário fecha o popover (clicando fora ou no botão "Fechar").

### `data` (object) - Obrigatório
Objeto contendo todos os dados a serem exibidos no popover.

#### Estrutura do objeto `data`:

```typescript
{
  // Status do campo
  status: string;              // Ex: "Em descomissionamento"
  
  // Título principal
  title: string;               // Ex: "BM-S-11A - Iara"
  
  // Tags de localização (opcional)
  tags?: string[];             // Ex: ["Berbigão", "Sururu", "Oeste de Atapú"]
  
  // Informações da operadora
  operator: string;            // Ex: "Shell"
  operatorDescription: string; // Ex: "Responsável pela administração do campo"
  
  // Informações de profundidade
  depth: string;               // Ex: "~400-870m"
  depthDescription: string;    // Ex: "Distância da superfície do mar até o fundo"
  
  // Empresas participantes (opcional)
  companies?: Array<{
    name: string;              // Nome da empresa
    percentage: number;        // Porcentagem de participação (0-100)
    isOperator: boolean;       // Se é a empresa operadora (destaque vermelho)
  }>;
  
  // Infraestrutura (opcional)
  infrastructure?: string;             // Ex: "2 FPSOs em operação"
  infrastructureDescription?: string;  // Descrição da infraestrutura
  infrastructureItems?: string[];      // Ex: ["P68", "P70"]
}
```

## 🎨 Customização de Cores

As barras de progresso da seção de empresas usam cores diferentes:
- **Operadora (Shell)**: Vermelho (`#DD1D21`) - definido pela classe `.is-operator`
- **Outras empresas**: Cinza (`#616161`)

Para customizar as cores, edite o arquivo `PopoverPins.css`:

```css
.popover-pins-progress-fill {
  background-color: #616161; /* Cor padrão */
}

.popover-pins-progress-fill.is-operator {
  background-color: #DD1D21; /* Cor da operadora */
}
```

## 📱 Responsividade

O componente é totalmente responsivo com breakpoint em 768px:
- **Desktop**: Layout em duas colunas para informações
- **Mobile**: Layout em coluna única com tamanhos de fonte ajustados

## 🎯 Exemplos

### Exemplo 1: Popover Completo

```jsx
const dataCompleta = {
  status: "Em operação",
  title: "Campo Mero",
  tags: ["Libra"],
  operator: "Petrobras",
  operatorDescription: "Responsável pela operação do campo",
  depth: "~2000m",
  depthDescription: "Profundidade da lâmina d'água",
  companies: [
    { name: "Petrobras", percentage: 40, isOperator: true },
    { name: "Shell", percentage: 20, isOperator: false },
    { name: "TotalEnergies", percentage: 20, isOperator: false },
    { name: "CNPC", percentage: 10, isOperator: false },
    { name: "CNOOC", percentage: 10, isOperator: false }
  ],
  infrastructure: "1 FPSO em operação",
  infrastructureDescription: "FPSO Mero",
  infrastructureItems: ["P-70"]
};
```

### Exemplo 2: Popover Simplificado (sem infraestrutura)

```jsx
const dataSimples = {
  status: "Em exploração",
  title: "Bloco ABC-1",
  operator: "Shell",
  operatorDescription: "Operadora do bloco",
  depth: "~1500m",
  depthDescription: "Profundidade estimada",
  companies: [
    { name: "Shell", percentage: 60, isOperator: true },
    { name: "Petrobras", percentage: 40, isOperator: false }
  ]
};
```

### Exemplo 3: Popover Mínimo

```jsx
const dataMinima = {
  status: "Em estudo",
  title: "Área XYZ",
  operator: "Shell",
  operatorDescription: "Operadora da área",
  depth: "~1000m",
  depthDescription: "Profundidade prevista"
};
```

## 🔧 Dependências

- React 19+
- react-dom (para createPortal)
- Fontes Shell (ShellLight, ShellBook, ShellMedium, ShellBold, ShellHeavy)

## 📁 Arquivos

- `PopoverPins.jsx` - Componente principal
- `PopoverPins.css` - Estilos do componente
- `PopoverPins.example.jsx` - Exemplo de uso
- `PopoverPins.README.md` - Documentação

## 🎭 Comportamento

1. **Abertura**: Animação de fade-in e scale-in
2. **Fechamento**: Pode ser fechado de duas formas:
   - Clicando no botão "Fechar"
   - Clicando fora do card (no overlay)
3. **Scroll**: Se o conteúdo for maior que 90vh, o card terá scroll interno
4. **Portal**: O popover é renderizado diretamente no `document.body` para evitar problemas de z-index

## 🎨 Paleta de Cores (Shell)

- **Cinza 800**: `#343434` - Textos principais
- **Cinza 600**: `#616161` - Textos secundários e ícone de status
- **Cinza 400**: `#919191` - Borda do botão
- **Cinza 100**: `#E0E0E0` - Bordas e backgrounds
- **Cinza 50**: `#F5F5F5` - Hover do botão
- **Vermelho 500**: `#DD1D21` - Destaque da operadora Shell
- **Branco**: `#FFFFFF` - Background do card

## ⚡ Performance

- Usa `createPortal` para renderização eficiente
- Animações CSS com GPU acceleration
- Scroll confinado ao card interno
- Fechamento otimizado com `stopPropagation`

## 📝 Notas

- O componente não renderiza nada quando `isOpen={false}` ou `data={null}`
- Todas as seções (tags, companies, infrastructure) são opcionais
- As fontes Shell devem estar carregadas previamente (via `index.css`)
- O componente usa CSS moderno (Grid, Flexbox, custom properties)

