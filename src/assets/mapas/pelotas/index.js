// Importação estática de todos os SVGs
// Isso garante que o Vite processe e otimize os arquivos corretamente

// Nota: Vite processa ?raw para importar o conteúdo como string
import svg2024 from './2024.svg?raw';
import svg2025 from './2025.svg?raw';

// Exportar mapeamento de anos para conteúdo SVG
export const svgFiles = {
  '2024': svg2024,
  '2025': svg2025
};

// Função auxiliar para obter SVG por ano
export const getSVGByYear = (year) => {
  return svgFiles[year] || svgFiles['2025'];
};

