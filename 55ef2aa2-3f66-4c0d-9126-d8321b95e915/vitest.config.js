import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        reporters: ["default", "junit"],
        outputFile: "test-results.xml",
        watch: false,
        testTimeout: 30000,
    }
})