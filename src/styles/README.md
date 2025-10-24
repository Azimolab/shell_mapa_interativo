# Cores da Shell Library

Este diretório contém as variáveis de cores importadas do Figma ([ShellLibrary](https://www.figma.com/design/QstgoMsgyKyiltrQhAjdI3/ShellLibrary?node-id=1-2)).

## Arquivos

- **`colors.css`** - Variáveis CSS customizadas para uso global
- **`colors.js`** - Objeto JavaScript/React para uso programático

## Como Usar

### No CSS/Tailwind

As variáveis são importadas automaticamente no `index.css` e ficam disponíveis em todo o projeto:

```css
.meu-componente {
  background-color: var(--color-blue-400);
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-200);
}

/* Ou use os aliases semânticos */
.botao-primario {
  background-color: var(--color-primary);
}

.alerta-erro {
  color: var(--color-danger);
}
```

### No React/JavaScript

Importe o objeto de cores:

```jsx
import { colors, semantic } from './styles/colors';

function MeuComponente() {
  return (
    <div style={{ backgroundColor: colors.blue[400] }}>
      <p style={{ color: colors.gray[700] }}>Texto</p>
      <button style={{ backgroundColor: semantic.primary }}>
        Botão Primário
      </button>
    </div>
  );
}
```

## Paletas Disponíveis

### Gray (Cinza - Padrão)
Tons neutros para fundos, bordas e textos secundários.
- Variações: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900`

### Blue (Azul - Primária)
Cor principal da identidade visual.
- Variações: `50, 100, 200, 300, 400 (Main), 500, 600, 700, 800, 900`
- Alias: `--color-primary`

### Sky (Azul Celeste - Info)
Para informações e mensagens informativas.
- Variações: `50, 100, 200, 300, 400 (Main), 500, 600, 700, 800, 900`
- Alias: `--color-info`

### Forest (Verde Floresta - Sucesso)
Para confirmações e estados de sucesso.
- Variações: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900`
- Alias: `--color-success`

### Yellow (Amarelo - Aviso)
Para alertas e avisos.
- Variações: `50, 100, 200 (Main), 300, 400, 500, 600, 700, 800, 900`
- Alias: `--color-warning`

### Sunrise (Laranja - Perigo)
Para erros e ações destrutivas (alternativa).
- Variações: `50, 100, 200, 300, 400, 500 (Main), 600, 700, 800, 900`

### Red (Vermelho - Perigo)
Para erros e ações destrutivas.
- Variações: `50, 100, 200, 300, 400, 500 (Main), 600, 700, 800, 900`
- Aliases: `--color-danger`, `--color-error`

## Aliases Semânticos

Para facilitar o uso, foram criados aliases semânticos:

| Alias | Cor | Uso |
|-------|-----|-----|
| `--color-primary` | Blue 400 | Ações principais, botões primários |
| `--color-info` | Sky 400 | Mensagens informativas |
| `--color-success` | Forest 500 | Confirmações, sucesso |
| `--color-warning` | Yellow 200 | Avisos, atenção |
| `--color-danger` | Red 500 | Erros, ações destrutivas |
| `--color-error` | Red 500 | Mensagens de erro |

## Acessibilidade

Todas as cores foram projetadas seguindo padrões de acessibilidade:

- **Contraste**: As variações garantem contraste adequado entre texto e fundo
- **Cores Principais (400/500)**: Testadas para WCAG 2.1 nível AA
- **Tons Claros (50-300)**: Ideais para fundos
- **Tons Escuros (600-900)**: Ideais para textos

## Exemplos de Uso

### Botões

```jsx
// Primário
<button style={{ 
  backgroundColor: colors.blue[400], 
  color: 'white' 
}}>
  Salvar
</button>

// Sucesso
<button style={{ 
  backgroundColor: colors.forest[500], 
  color: 'white' 
}}>
  Confirmar
</button>

// Perigo
<button style={{ 
  backgroundColor: colors.red[500], 
  color: 'white' 
}}>
  Excluir
</button>
```

### Alertas

```jsx
// Info
<div style={{ 
  backgroundColor: colors.sky[50], 
  borderLeft: `4px solid ${colors.sky[400]}`,
  padding: '1rem' 
}}>
  <p style={{ color: colors.sky[700] }}>Informação importante</p>
</div>

// Aviso
<div style={{ 
  backgroundColor: colors.yellow[50], 
  borderLeft: `4px solid ${colors.yellow[400]}`,
  padding: '1rem' 
}}>
  <p style={{ color: colors.yellow[700] }}>Atenção!</p>
</div>

// Erro
<div style={{ 
  backgroundColor: colors.red[50], 
  borderLeft: `4px solid ${colors.red[500]}`,
  padding: '1rem' 
}}>
  <p style={{ color: colors.red[700] }}>Erro ao processar</p>
</div>
```

### Cards

```css
.card {
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  padding: 1rem;
}

.card-header {
  color: var(--color-gray-900);
  border-bottom: 1px solid var(--color-gray-200);
}

.card-body {
  color: var(--color-gray-700);
}
```

## Manutenção

Para atualizar as cores do Figma:

1. Acesse o [arquivo do Figma](https://www.figma.com/design/QstgoMsgyKyiltrQhAjdI3/ShellLibrary?node-id=1-2)
2. Verifique as alterações na página "Color"
3. Atualize os valores em `colors.css` e `colors.js`
4. Teste os componentes existentes para garantir compatibilidade

