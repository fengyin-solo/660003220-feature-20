<template>
  <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
    <h3 class="text-sm font-bold text-slate-400 mb-3">SMILES 输入</h3>
    <div class="space-y-2">
      <div class="relative">
        <textarea
          v-model="inputSmiles"
          @input="onInputChange"
          @keydown.enter.exact.prevent="onSubmit"
          placeholder="例如: CC(=O)Oc1ccccc1C(=O)O (阿司匹林)"
          rows="3"
          :class="[
            'w-full bg-slate-900 border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none resize-none transition-all',
            inputSmiles.trim()
              ? validation.valid
                ? 'border-cyan-500 focus:border-cyan-400'
                : 'border-red-500 focus:border-red-400'
              : 'border-slate-600 focus:border-cyan-500'
          ]"
        />
        <div v-if="inputSmiles.trim() && validation.valid" class="absolute top-2 right-2">
          <span class="text-xs px-2 py-0.5 rounded bg-green-900/50 text-green-400">格式正确</span>
        </div>
      </div>

      <div v-if="validation.errors.length > 0" class="space-y-1">
        <div v-for="(error, idx) in validation.errors" :key="'err-' + idx"
          class="flex items-start gap-2 text-xs text-red-400 bg-red-900/20 rounded px-2 py-1.5">
          <span>✗</span>
          <span>{{ error }}</span>
        </div>
      </div>

      <div v-if="validation.warnings.length > 0" class="space-y-1">
        <div v-for="(warning, idx) in validation.warnings" :key="'warn-' + idx"
          class="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-900/20 rounded px-2 py-1.5">
          <span>⚠</span>
          <span>{{ warning }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="onSubmit"
          :disabled="!canSubmit"
          :class="[
            'flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all',
            canSubmit
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          ]"
        >
          解析分子结构
        </button>
        <button
          @click="onClear"
          v-if="inputSmiles"
          class="px-3 py-2 rounded-lg text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all"
        >
          清空
        </button>
      </div>

      <div class="text-xs text-slate-500 pt-1">
        <span class="font-bold">提示：</span>支持标准 SMILES 语法，包括元素符号、键类型 (= # -)、分支括号 ()、环编号、方括号原子 []
      </div>

      <div class="pt-2 border-t border-slate-700">
        <div class="text-xs text-slate-500 mb-2">快速示例：</div>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="(ex, idx) in exampleList"
            :key="idx"
            @click="setExample(ex.smiles)"
            class="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all"
          >
            {{ ex.name }}({{ ex.smiles }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMoleculeStore, validateSMILES, type ValidationResult } from '../store/molecule'

const store = useMoleculeStore()
const inputSmiles = ref('')
const lastValidation = ref<ValidationResult>({ valid: false, errors: [], warnings: [] })

const exampleList = [
  { name: '乙醇', smiles: 'CCO' },
  { name: '苯', smiles: 'c1ccccc1' },
  { name: '阿司匹林', smiles: 'CC(=O)Oc1ccccc1C(=O)O' },
  { name: '咖啡因', smiles: 'Cn1c(=O)c2c(ncn2C)n(C)c1=O' }
]

const validation = computed(() => {
  if (!inputSmiles.value.trim()) {
    return { valid: true, errors: [], warnings: [] }
  }
  lastValidation.value = validateSMILES(inputSmiles.value)
  return lastValidation.value
})

const canSubmit = computed(() => {
  return validation.value.valid && inputSmiles.value.trim() !== ''
})

function onInputChange() {}

function onSubmit() {
  if (!canSubmit.value) return
  store.parseCustomSMILES(inputSmiles.value)
}

function onClear() {
  inputSmiles.value = ''
}

function setExample(smiles: string) {
  inputSmiles.value = smiles
}
</script>
