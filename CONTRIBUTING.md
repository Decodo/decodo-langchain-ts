# Contributing

## Releases

Releases are automated. Merging to `main` publishes a new version based on the
PR title, which must follow [Conventional Commits](https://www.conventionalcommits.org):
`fix:` → patch, `feat:` → minor, `feat!:` or a `BREAKING CHANGE:` footer → major.
`chore:`, `docs:`, `ci:`, `refactor:`, `test:` don't release. Don't edit the
version in `package.json`.
