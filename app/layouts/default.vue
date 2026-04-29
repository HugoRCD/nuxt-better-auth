<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

useOrgs()

const open = ref(false)

const links = [
  [
    {
      label: 'User',
      icon: 'i-lucide-user',
      to: '/app/user',
      onSelect: () => {
        open.value = false
      }
    }, {
      label: 'Notes',
      icon: 'i-lucide-notebook-pen',
      to: '/app/notes',
      onSelect: () => {
        open.value = false
      }
    }, {
      label: 'Admin',
      icon: 'i-lucide-shield-check',
      to: '/app/admin',
      onSelect: () => {
        open.value = false
      }
    }
  ], [
    {
      label: 'Feedback',
      icon: 'i-lucide-message-circle',
      to: 'https://github.com/nuxt-ui-templates/dashboard',
      target: '_blank'
    }, {
      label: 'Help & Support',
      icon: 'i-lucide-info',
      to: 'https://github.com/nuxt/ui',
      target: '_blank'
    }
  ]
] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel id="home">
      <template #header>
        <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <ImpersonationBanner />
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
