// Importação estática de todos os SVGs
// Isso garante que o Vite processe e otimize os arquivos corretamente

// Nota: Vite processa ?raw para importar o conteúdo como string
import svg2018 from './2018.svg?raw';
import svg2019 from './2019.svg?raw';
import svg2020 from './2020.svg?raw';
import svg2021 from './2021.svg?raw';
import svg2022 from './2022.svg?raw';
import svg2023 from './2023.svg?raw';
import svg2024 from './2024.svg?raw';
import svg2025 from './2025.svg?raw';

// Exportar mapeamento de anos para conteúdo SVG
export const svgFiles = {
  '2018': svg2018,
  '2019': svg2019,
  '2020': svg2020,
  '2021': svg2021,
  '2022': svg2022,
  '2023': svg2023,
  '2024': svg2024,
  '2025': svg2025
};

// Função auxiliar para obter SVG por ano
export const getSVGByYear = (year) => {
  return svgFiles[year] || svgFiles['2025'];
};

