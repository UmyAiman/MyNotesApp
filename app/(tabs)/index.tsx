import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { ref, push, onValue, remove } from 'firebase/database';
import { db } from '../../firebaseConfig';

type Note = {
  id: string;
  text: string;
};

export default function App() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');

  // 🔹 Fetch notes from Firebase
  useEffect(() => {
    const notesRef = ref(db, 'notes/');
    const unsubscribe = onValue(notesRef, snapshot => {
      const data = snapshot.val();
      const list: Note[] = data
        ? Object.keys(data).map(key => ({
            id: key,
            text: data[key].text,
          }))
        : [];
      setNotes(list);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Add note
  const addNote = () => {
    if (note.trim() === '') return;
    push(ref(db, 'notes/'), { text: note });
    setNote('');
  };

  // 🔹 Delete note
  const deleteNote = (id: string) => {
    remove(ref(db, `notes/${id}`));
  };

  // 🔹 Search filter
  const filteredNotes = notes.filter(item =>
    item.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>My Notes App</Text>

      <TextInput
        placeholder="Enter note"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <Button title="Add Note" onPress={addNote} />

      <TextInput
        placeholder="Search note"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes found</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <Text style={styles.noteText}>{item.text}</Text>
            <Button title="Delete" onPress={() => deleteNote(item.id)} />
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  noteText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
});
