# @webex/dashboard-ui

A UI library based on web components that is for building dashboards.

## Getting Started

*// TODO: we will provide the CDN files and npm package*

## Contributing

### Prerequisites

- Install [Node.js](https://nodejs.org/) which includes [Node Package Manager](https://docs.npmjs.com/getting-started). We recommend to use version 16.

### Steps to Start

1. Clone this repo.

1. Install all dependencies via run command `npm install`.

1. Now, run `npm start` to start your work.

    - The component code should be placed to **src/components**. The new component should be structured as below:

      ```
      new-component
        ├─ index.ts                 // should export all public members
        ├─ new-component.ts         // the component code
        ├─ new-component.spec.ts    // unit tests
        ├─ new-component.types.ts   // all types definitions
        └─ new-component.plugins.ts // plugins of chart.js if need
      ```

    - The style file should be placed with component code and imported in **src/styles/main.scss**.

    - Also export the new component in **src/components/index.ts** file.

1. Commit your changes and push them to your forked repo, and submit a Pull Request to **main** branch.

### Commit Message Guidelines

All commit message MUST follow [Angular Commit Message Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit).

Format as:

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: <component-name>
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

### Useful Commands

- `npm run data` will print the random data which is predefined in **./tools/data.ts** and can be used to test your component. For example, `npm run data -- --pie --default --5`