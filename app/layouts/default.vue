<template>
    <div>
        <StructuresAppHeader class="fixed z-50" />
        <div>
            <main class="bg-neutral-950 min-h-[calc(100vh-48px)] text-white pt-20 pb-10">
                <slot />
            </main>
        </div>

        <StructuresAppFooter />
    </div>
</template>