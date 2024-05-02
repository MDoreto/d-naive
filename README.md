# d-naive

## Overview

`d-naive` is a Vue library designed to enhance Naive UI components with additional functionalities for complex data handling and user input management. It includes a robust `DDataTable` component and a versatile `DInput` component, making it suitable for a wide range of applications.

## Installation

Install `d-naive` with npm:

```bash
npm install d-naive
```
## Components

### DataTable

The `DataTable` component provides advanced features such as sorting, pagination, filtering, and cell editing.

#### Props

- **data**: Array of data objects.
- **columns**: Definitions of the table columns.
- **pagination**: Configuration options for pagination.
- **editable**: Boolean to enable editing directly in the table.
- **scrollX**: Horizontal scrolling setting.

#### Events

- **update:expanded**: Emitted when the expanded rows are updated.
- **put**: Emitted after confirming data modifications.
- **delete**: Emitted when an item is deleted.

#### Methods

- **resetFilters()**: Clears all applied filters.
- **scrollTo(value)**: Scrolls to the specified row.
- **getData()**: Returns the current data displayed in the table.

### DInput

The `DInput` component manages various types of inputs including text, select, number, date, and checkbox, with options for validation and custom formatting.

#### Props

- **modelValue**: The input's bound value.
- **type**: The type of input (e.g., text, select, date).
- **options**: Options for select inputs, if applicable.

#### Events

- **update:modelValue**: Emitted when the input value changes.

## Helper Functions

### `formatValue(row, field)`

Formats a value based on the specified field's type.

### `getValue(row, field)`

Retrieves a value from an object based on a dot-notated key string.

## Usage Example

Here is an example of using the `DDataTable` component in a Vue application:

```vue
<template>
  <d-data-table :data="users" :columns="columns" />
</template>

<script>

export default {

  data() {
    return {
      users: [{ id: 1, name: 'John Doe', age: 30 }],
      columns: [
        { title: 'ID', key: 'id' },
        { title: 'Name', key: 'name' },
        { title: 'Age', key: 'age', sortable: true }
      ]
    };
  }
}
</script>
