import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Picker,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [input, setInput] = useState("");
  const [state, setState] = useState({
    todo: {
      title: "To do",
      items: [],
    },
    inProgress: {
      title: "In Progress",
      items: [],
    },
    done: {
      title: "Completed",
      items: [],
    },
  });

  const handleDragEnd = ({ data, from, to }) => {
    if (from === to) return;

    const updatedItems = [...state[data.droppableId].items];
    const [removedItem] = updatedItems.splice(from, 1);
    updatedItems.splice(to, 0, removedItem);

    setState((prev) => ({
      ...prev,
      [data.droppableId]: {
        ...prev[data.droppableId],
        items: updatedItems,
      },
    }));
  };

  const changeList = (taskIndex, sourceListKey, destinationListKey) => {
    setState((prevState) => {
      const newState = { ...prevState };
      const taskToMove = newState[sourceListKey].items.splice(taskIndex, 1)[0];
      newState[destinationListKey].items.push(taskToMove);
      return newState;
    });
  };

  const removeTask = (taskIndex, sourceListKey) => {
    setState((prevState) => {
        const newState = { ...prevState };
        newState[sourceListKey].items.splice(taskIndex, 1); // Remove the task
        return newState;
    });
  };

  const addItem = () => {
    if (input.trim() === "") return;
    setState((prev) => ({
      ...prev,
      todo: {
        ...prev.todo,
        items: [{ id: uuidv4(), name: input }, ...prev.todo.items],
      },
    }));
    setInput("");
  };

  const renderItem = ({ item, index, drag, isActive }) => {
    const sourceListKey = Object.keys(state).find(key =>
      state[key].items.includes(item)
    );

    return (
        <View style={styles.itemContainer} nDragEnd={handleDragEnd}>
            <TouchableOpacity
                style={[styles.item, isActive && styles.dragging]}
                onLongPress={drag}
            >
                <Text style={styles.itemText}>{item?.name}</Text>
                <Picker
                    selectedValue={sourceListKey}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        if (itemValue !== sourceListKey) {
                            changeList(index, sourceListKey, itemValue);
                        }
                    }}
                >
                    {Object.keys(state).map((key) => (
                        <Picker.Item key={key} label={state[key].title} value={key} />
                    ))}
                </Picker>
                <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeTask(index, sourceListKey)}
            >
                <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
            </TouchableOpacity>
           
        </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Task"
          value={input}
          onChangeText={(text) => setInput(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.columnContainer}>
        {Object.keys(state).map((key) => (
          <View key={key} style={styles.column}>
            <Text style={styles.columnTitle}>{state[key].title}</Text>
            <DraggableFlatList
              data={state[key].items}
              renderItem={renderItem}
              keyExtractor={(item) => item?.id || item?.name || Math.random().toString()}
              onDragEnd={({ data }) => {
                setState((prev) => ({
                  ...prev,
                  [key]: {
                    ...prev[key],
                    items: data,
                  },
                }));
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f2f5",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#8c9ea3",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "#333333",
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  columnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  column: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  columnTitle: {
    backgroundColor: "#2c3e50",
    color: "white",
    textAlign: "center",
    padding: 10,
    borderRadius: 6,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  item: {
    padding: 15,
    backgroundColor: "#3498db",
    marginBottom: 10,
    borderRadius: 6,
    borderColor: "#2980b9",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
  },
  dragging: {
    backgroundColor: "#1abc9c",
  },
  itemText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  removeButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 6,
    marginLeft: 10,
    marginTop:10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  picker: {
    color: "#34495e",
    marginTop: 10,
  },
});

