/**
 * Pre-deployment check script
 * 
 * Usage: npm run check:deploy
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

console.log('🔍 Проверка готовности к деплою...\n')

let errors = 0
let warnings = 0

// Check 1: next.config.ts has output: 'export'
try {
  const nextConfig = readFileSync(resolve(process.cwd(), 'next.config.ts'), 'utf-8')
  if (nextConfig.includes("output: 'export'") || nextConfig.includes('output: "export"')) {
    console.log('✅ next.config.ts настроен для static export')
  } else {
    console.log('❌ next.config.ts: отсутствует output: "export"')
    errors++
  }
} catch {
  console.log('❌ Не найден next.config.ts')
  errors++
}

// Check 2: distDir is set
try {
  const nextConfig = readFileSync(resolve(process.cwd(), 'next.config.ts'), 'utf-8')
  if (nextConfig.includes('distDir')) {
    console.log('✅ distDir настроен')
  } else {
    console.log('⚠️  Рекомендуется добавить distDir: "dist" в next.config.ts')
    warnings++
  }
} catch {
  // Already handled above
}

// Check 3: .env.production exists
try {
  const envProd = readFileSync(resolve(process.cwd(), '.env.production'), 'utf-8')
  if (envProd.includes('NEXT_PUBLIC_SUPABASE_URL') && envProd.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
    console.log('✅ .env.production настроен')
    
    if (envProd.includes('your-project') || envProd.includes('your-anon-key')) {
      console.log('⚠️  .env.production содержит placeholder значения - замените на реальные!')
      warnings++
    }
  } else {
    console.log('❌ .env.production: отсутствуют переменные Supabase')
    errors++
  }
} catch {
  console.log('❌ Не найден .env.production')
  console.log('   Создайте файл: cp .env.production.example .env.production')
  errors++
}

// Check 4: package.json has build script
try {
  const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'))
  if (packageJson.scripts?.build) {
    console.log('✅ build script настроен')
  } else {
    console.log('❌ package.json: отсутствует build script')
    errors++
  }
} catch {
  console.log('❌ Не найден package.json')
  errors++
}

// Check 5: .gitignore doesn't include .env.production
try {
  const gitignore = readFileSync(resolve(process.cwd(), '.gitignore'), 'utf-8')
  if (gitignore.includes('.env.production')) {
    console.log('⚠️  .gitignore исключает .env.production')
    console.log('   Для GitFlic Pages .env.production должен быть в git!')
    warnings++
  } else {
    console.log('✅ .env.production не исключен в .gitignore')
  }
} catch {
  console.log('⚠️  Не найден .gitignore')
  warnings++
}

// Check 6: No server-side code in app/api (warn only)
try {
  const apiDir = resolve(process.cwd(), 'app/api')
  console.log('ℹ️  Обнаружена папка app/api - API Routes не будут работать на статическом хостинге')
  console.log('   Убедитесь что клиент делает запросы напрямую к Supabase')
  warnings++
} catch {
  // No API directory
}

console.log('\n' + '='.repeat(50))
console.log(`Результат: ${errors} ошибок, ${warnings} предупреждений`)

if (errors === 0) {
  console.log('\n✅ Проект готов к деплою!')
  console.log('\nСледующие шаги:')
  console.log('1. Замените placeholder значения в .env.production на реальные')
  console.log('2. Запустите: npm run build')
  console.log('3. Проверьте папку dist/')
  console.log('4. Создайте репозиторий на GitFlic')
  console.log('5. Запушьте код: git push gitflic main')
  console.log('\n📖 Подробная инструкция: DEPLOY_GITFLIC.md')
} else {
  console.log('\n❌ Исправьте ошибки перед деплоем')
  process.exit(1)
}
