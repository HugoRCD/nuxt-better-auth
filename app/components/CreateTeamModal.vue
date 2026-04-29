<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const state = reactive<Partial<CreateTeamSchema>>({
  name: '',
  slug: '',
  logo: ''
})

const {
  createTeam,
} = useOrgs()

const emit = defineEmits<{ close: [boolean] }>()

async function create(event: FormSubmitEvent<CreateTeamSchema>) {
  await createTeam(event)
  emit('close', true)
}
</script>

<template>
  <UModal :close="{ onClick: () => emit('close', false) }">
    <template #content>
      <UPageCard title="Create Team">
        <UForm :schema="createTeamSchema" :state class="flex flex-col gap-2" @submit="create">
          <UFormField label="Name" name="name" required>
            <UInput v-model="state.name" />
          </UFormField>
          <UFormField label="Slug" name="slug" required>
            <UInput v-model="state.slug" />
          </UFormField>
          <UFormField label="Logo" name="logo">
            <UInput v-model="state.logo" />
          </UFormField>
          <UButton type="submit" label="Create Team" block class="mt-4" />
        </UForm>
      </UPageCard>
    </template>
  </UModal>
</template>
