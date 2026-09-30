export default {
  overrides: [
    { files: ["**/*.astro"], customSyntax: "postcss-html" },
    { files: ["**/*.css"] }
  ],
  rules: {
    "declaration-property-value-disallowed-list": [
      { "background": ["/#6366f1/", "/#8b5cf6/"], "border-radius": ["9999px"] },
      { severity: "error", message: "Use tokens: no indigo, keep radii 6/8/12 — see DESIGN.md" }
    ]
  }
}
