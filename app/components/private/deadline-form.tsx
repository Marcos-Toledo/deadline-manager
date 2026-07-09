"use client";

import { createDeadline } from "@/actions/deadlines";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import { MESSAGES } from "@/lib/messages";
import { type CreateDeadlineInput, type DeadlineType } from "@/types";
import { Loader2, Plus } from "lucide-react";
import { useRef, useState, useTransition } from "react";

const TYPE_OPTIONS: { value: DeadlineType; label: string }[] = [
  { value: "hearing", label: "Audiência" },
  { value: "expertise", label: "Perícia" },
  { value: "deadline", label: "Prazo" },
  { value: "meeting", label: "Reunião" },
  { value: "other", label: "Outro" },
];

const INITIAL_FORM: CreateDeadlineInput = {
  title: "",
  description: "",
  date: "",
  type: "deadline",
  processNumber: "",
};

interface DeadlineFormProps {
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function DeadlineForm({ onSuccess, children }: DeadlineFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<CreateDeadlineInput>(INITIAL_FORM);
  const { showSuccess, showError } = useActionFeedback();

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => {
    dialogRef.current?.close();
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await createDeadline(form);
      if (result.success) {
        setForm(INITIAL_FORM);
        closeModal();
        showSuccess(MESSAGES.deadlines.created);
        onSuccess?.();
      } else {
        showError(result.error ?? MESSAGES.deadlines.createError);
      }
    });
  };

  return (
    <>
      {children ? (
        { children }
      ) : (
        <button className="btn btn-primary" onClick={openModal}>
          <Plus className="w-5 h-5" />
          Novo prazo
        </button>
      )}

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Novo prazo</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="label">Título</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Ex: Audiência de instrução"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Número do processo</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Ex: 0000000-00.0000.0.00.0000"
                value={form.processNumber}
                onChange={(e) =>
                  setForm({ ...form, processNumber: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="label">Data e hora</label>
                <input
                  type="datetime-local"
                  className="input w-full"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Tipo</label>
                <select
                  className="select w-full"
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as DeadlineType })
                  }
                >
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Descrição</label>
              <textarea
                className="textarea w-full"
                placeholder="Detalhes do prazo..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="modal-action">
              <button type="button" className="btn" onClick={closeModal}>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar prazo"
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
