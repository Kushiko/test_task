import React, { Component } from "react";

export type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  selectedOptions: Option[];
  onSelectionChange: (selected: Option[]) => void;
  placeholder?: string;
};

type State = {
  search: string;
  isOpen: boolean;
};

export class Multiselect extends Component<Props, State> {
  state: State = {
    search: "",
    isOpen: false,
  };

  dropdownRef = React.createRef<HTMLDivElement>();
  listRef = React.createRef<HTMLUListElement>(); // Ref для списка

  componentDidMount() { 
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  // Закрытие дропдауна при клике вне его области
  handleClickOutside = (event: MouseEvent) => {
    if (
      this.dropdownRef.current &&
      !this.dropdownRef.current.contains(event.target as Node)
    ) {
      this.setState({ isOpen: false });
    }
  };

  toggleDropdown = () => {
    this.setState((prev) => ({ isOpen: !prev.isOpen }));
  };

  handleSelect = (option: Option) => {
    const { selectedOptions, onSelectionChange } = this.props;
    const exists = selectedOptions.find((o) => o.value === option.value);

    // Сохраняем текущую позицию прокрутки при выборе элемента(дропдаун может немного дёргаться из-за обновления состояния)
    const scrollTop = this.listRef.current?.scrollTop || 0;

    if (exists) {
      onSelectionChange(selectedOptions.filter((o) => o.value !== option.value));
    } else {
      onSelectionChange([...selectedOptions, option]);
    }

    // Восстанавливаем позицию прокрутки после обновления состояния
    setTimeout(() => {
      if (this.listRef.current) {
        this.listRef.current.scrollTop = scrollTop;
      }
    }, 0);
  };

  handleClearAll = () => {
    this.props.onSelectionChange([]);
  };

  handleRemoveOption = (value: string) => {
    this.props.onSelectionChange(
      this.props.selectedOptions.filter((o) => o.value !== value)
    );
  };

  getFilteredOptions = () => {
    const { search } = this.state;
    const { options, selectedOptions } = this.props;

    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const selected = filtered.filter((opt) =>
      selectedOptions.find((o) => o.value === opt.value)
    );
    const notSelected = filtered.filter(
      (opt) => !selectedOptions.find((o) => o.value === opt.value)
    );

    return [...selected, ...notSelected];
  };

  render() {
    const { selectedOptions, placeholder } = this.props;
    const { search, isOpen } = this.state;
    const options = this.getFilteredOptions();

    return (
      <div
        className="items-center justify-center text-black w-full min-w-md flex relative text-sm"
        ref={this.dropdownRef}
      >
        <div className="border rounded p-2 relative bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={placeholder || "Select..."}
              className="w-full border-b outline-none p-1"
              onFocus={this.toggleDropdown}
              value={search}
              onChange={(e) => this.setState({ search: e.target.value })}
            />
          </div>

          {isOpen && (
            <ul
              ref={this.listRef}
              className="left-0 absolute z-10 w-full bg-white shadow max-h-60 overflow-y-auto mt-3 border rounded "
            >
              {options.length === 0 && (
                <li className="p-2 text-gray-500">No options</li>
              )}
              {options.map((opt) => {
                const isSelected = !!selectedOptions.find(
                  (o) => o.value === opt.value
                );
                return (
                  <li
                    key={opt.value}
                    onClick={() => this.handleSelect(opt)}
                    className={`p-2 cursor-pointer hover:bg-blue-100 flex items-center justify-between ${
                      isSelected ? "bg-blue-50 font-medium" : ""
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                      <path d="M 41.9375 8.625 C 41.273438 8.648438 40.664063 9 40.3125 9.5625 L 21.5 38.34375 L 9.3125 27.8125 C 8.789063 27.269531 8.003906 27.066406 7.28125 27.292969 C 6.5625 27.515625 6.027344 28.125 5.902344 28.867188 C 5.777344 29.613281 6.078125 30.363281 6.6875 30.8125 L 20.625 42.875 C 21.0625 43.246094 21.640625 43.410156 22.207031 43.328125 C 22.777344 43.242188 23.28125 42.917969 23.59375 42.4375 L 43.6875 11.75 C 44.117188 11.121094 44.152344 10.308594 43.78125 9.644531 C 43.410156 8.984375 42.695313 8.589844 41.9375 8.625 Z"></path>
                      </svg> // Галочка DONE(selected)
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {selectedOptions.length > 0 && (
          <button
            onClick={this.handleClearAll}
            className="ml-2 text-red-600 text-xs hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    );
  }
}
