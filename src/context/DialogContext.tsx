import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { palette, shadows } from '../theme/ui';

type DialogAction = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

type DialogState = {
  visible: boolean;
  title: string;
  message: string;
  actions: DialogAction[];
};

type DialogContextType = {
  showMessage: (
    title: string,
    message: string,
    options?: { actionLabel?: string; variant?: DialogAction['variant'] }
  ) => void;
  showConfirm: (
    title: string,
    message: string,
    options: {
      confirmLabel?: string;
      cancelLabel?: string;
      onConfirm: () => void;
      confirmVariant?: DialogAction['variant'];
    }
  ) => void;
  hideDialog: () => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

const defaultState: DialogState = {
  visible: false,
  title: '',
  message: '',
  actions: [],
};

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialog, setDialog] = useState<DialogState>(defaultState);

  const hideDialog = () => setDialog(defaultState);

  const showMessage: DialogContextType['showMessage'] = (title, message, options) => {
    setDialog({
      visible: true,
      title,
      message,
      actions: [
        {
          label: options?.actionLabel ?? 'Close',
          variant: options?.variant ?? 'primary',
        },
      ],
    });
  };

  const showConfirm: DialogContextType['showConfirm'] = (title, message, options) => {
    setDialog({
      visible: true,
      title,
      message,
      actions: [
        {
          label: options.cancelLabel ?? 'Cancel',
          variant: 'secondary',
        },
        {
          label: options.confirmLabel ?? 'Confirm',
          variant: options.confirmVariant ?? 'primary',
          onPress: options.onConfirm,
        },
      ],
    });
  };

  const value = useMemo(
    () => ({
      showMessage,
      showConfirm,
      hideDialog,
    }),
    []
  );

  const handleActionPress = (action: DialogAction) => {
    hideDialog();
    action.onPress?.();
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Modal
        transparent
        animationType="fade"
        visible={dialog.visible}
        onRequestClose={hideDialog}
      >
        <Pressable style={styles.overlay} onPress={hideDialog}>
          <Pressable style={styles.card} onPress={() => undefined}>
            <Text style={styles.title}>{dialog.title}</Text>
            <Text style={styles.message}>{dialog.message}</Text>
            <View style={styles.actions}>
              {dialog.actions.map((action) => (
                <TouchableOpacity
                  key={action.label}
                  style={[styles.button, buttonStyles[action.variant ?? 'primary']]}
                  onPress={() => handleActionPress(action)}
                >
                  <Text style={[styles.buttonText, textStyles[action.variant ?? 'primary']]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }

  return context;
};

const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: palette.primary,
  },
  secondary: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  danger: {
    backgroundColor: '#f6d7d1',
  },
});

const textStyles = StyleSheet.create({
  primary: {
    color: '#fffdf9',
  },
  secondary: {
    color: palette.text,
  },
  danger: {
    color: palette.danger,
  },
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(35, 49, 58, 0.34)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadows.card,
  },
  title: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  message: {
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 24,
  },
  button: {
    minWidth: 96,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
