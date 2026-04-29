<script setup lang="ts">
// https://better-auth.vercel.app/docs/integrations/nuxt#ssr-usage
const { user, session, client, signOut } = useAuth()
const toast = useToast()
const { data: accounts } = await useAsyncData('accounts', () => client.listAccounts())

function hasProvider(provider: string) {
  return accounts.value?.data?.some(account => account.providerId === provider)
}

const error = useRoute().query?.error
onMounted(() => {
  if (error) {
    toast.add({
      color: 'error',
      title: error as string,
    })
  }
})

const isDeleteModalOpen = ref(false)
const deleteConfirmation = ref('')
const isDeletingAccount = ref(false)

async function deleteAccount() {
  if (deleteConfirmation.value !== user.value?.email) {
    toast.add({
      title: 'Confirmation failed',
      description: 'Please enter your email address to confirm',
      color: 'error'
    })
    return
  }

  isDeletingAccount.value = true

  try {
    await client.deleteUser()
    useCookie('activeOrganizationId').value = null
    
    toast.add({
      title: 'Account deleted',
      description: 'Your account has been permanently deleted',
      color: 'success'
    })
    
    await signOut({ redirectTo: '/' })
  } catch (error: any) {
    toast.add({
      title: 'Failed to delete account',
      description: error.message || 'An error occurred while deleting your account',
      color: 'error'
    })
  } finally {
    isDeletingAccount.value = false
    isDeleteModalOpen.value = false
    deleteConfirmation.value = ''
  }
}
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2">
    <UPageCard class="flex flex-col items-center p-6">
      <UAvatar
        v-if="user?.image"
        :src="user.image"
        alt="User avatar"
        class="rounded-full mx-auto size-20"
      />
      <div class="text-center">
        <div class="text-xl font-semibold">
          {{ user?.name }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{ user?.email }}
        </div>
        <div class="mt-2 flex flex-wrap justify-center gap-2">
          <UBadge v-if="user?.emailVerified" color="success" variant="soft">
            Email verified
          </UBadge>
          <UBadge v-else color="warning" variant="soft">
            Email not verified
          </UBadge>
        </div>
      </div>
      <div class="mt-4 w-full">
        <ul class="text-sm text-muted-foreground space-y-1">
          <li><span class="font-medium">ID:</span> {{ user?.id }}</li>
          <li><span class="font-medium">Created at:</span> {{ user?.createdAt }}</li>
          <li v-if="user?.updatedAt">
            <span class="font-medium">Updated at:</span> {{ user.updatedAt }}
          </li>
        </ul>
      </div>
    </UPageCard>

    <UPageCard class="p-6">
      <div class="text-lg font-semibold mb-2">
        Session
      </div>
      <ul class="text-sm text-muted-foreground space-y-1">
        <li><span class="font-medium">IP address:</span> {{ session?.ipAddress }}</li>
        <li><span class="font-medium">User Agent:</span> <span class="break-all">{{ session?.userAgent }}</span></li>
        <li><span class="font-medium">Expires at:</span> {{ session?.expiresAt }}</li>
        <li><span class="font-medium">Token:</span> <span class="break-all">{{ session?.token }}</span></li>
      </ul>
    </UPageCard>
  </div>

  <UPageCard class="p-6">
    <div class="text-lg font-semibold mb-2">
      Linked Accounts
    </div>
    <div>
      <UButton
        v-if="hasProvider('github')"
        color="neutral"
        icon="i-simple-icons-github"
        trailing-icon="i-heroicons-check"
        label="Linked with GitHub"
      />
      <UButton
        v-else
        color="neutral"
        icon="i-simple-icons-github"
        label="Link with GitHub"
        @click="client.linkSocial({ provider: 'github' })"
      />
    </div>
  </UPageCard>

  <UPageCard class="p-6 border-red-200 dark:border-red-800">
    <div class="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">
      Danger Zone
    </div>
    <div class="text-sm text-muted-foreground mb-4">
      Once you delete your account, there is no going back. Please be certain.
    </div>
    <div class="flex justify-end">
      <UButton
        color="error"
        variant="outline"
        icon="i-lucide-trash-2"
        label="Delete Account"
        @click="isDeleteModalOpen = true"
      />
    </div>
  </UPageCard>

  <UModal v-model:open="isDeleteModalOpen">
    <template #content>
      <UPageCard>
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-triangle-alert" class="text-error size-5" />
            <h2 class="text-lg font-semibold">
              Delete Account
            </h2>
          </div>
        </template>

        <div class="space-y-4">
          <div class="bg-error/10 border border-error/20 rounded-lg p-4">
            <p class="text-sm text-error">
              <strong>Warning:</strong> This action cannot be undone. This will permanently delete your account and all associated data including:
            </p>
            <ul class="mt-2 text-sm text-error list-disc list-inside space-y-1">
              <li>Your profile information</li>
              <li>All your teams and organizations</li>
              <li>All your notes and content</li>
              <li>Your session data</li>
            </ul>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">
              Type your email address to confirm:
            </label>
            <UInput
              v-model="deleteConfirmation"
              :placeholder="user?.email"
              :disabled="isDeletingAccount"
            />
          </div>
        </div>


        <div class="flex justify-end gap-3">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancel"
            :disabled="isDeletingAccount"
            @click="isDeleteModalOpen = false"
          />
          <UButton
            color="error"
            icon="i-lucide-trash-2"
            label="Delete Account"
            :loading="isDeletingAccount"
            :disabled="deleteConfirmation !== user?.email"
            @click="deleteAccount"
          />
        </div>
      </UPageCard>
    </template>
  </UModal>
</template>
