import { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, Button, message } from "antd";
import { createEntry, updateEntry } from "../api";
import "../index.css";

const { TextArea } = Input;
const { Option } = Select;

export default function EntryForm({
  isOpen,
  onRequestClose,
  onSaved,
  initial,
}: any) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initial) {
      form.setFieldsValue({
        ...initial,
        budget: initial.budget ?? undefined,
        duration: initial.duration ?? undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initial, form]);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        budget: values.budget || null,
        duration: values.duration || null,
        director: values.director || null,
        location: values.location || null,
        yearTime: values.yearTime || null,
        notes: values.notes || null,
        posterUrl: values.posterUrl || null,
      };

      if (initial?.id) {
        await updateEntry(initial.id, payload);
        message.success("Entry updated successfully!");
      } else {
        await createEntry(payload);
        message.success("Entry created successfully!");
      }

      form.resetFields();
      onSaved();
      onRequestClose();
    } catch (err) {
      console.error(err);
      message.error("Failed to save entry");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onRequestClose();
  };

  return (
    <Modal
      title={initial ? "Edit Entry" : "Add Entry"}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={700}
      className="modern-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: "MOVIE",
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
            className="col-span-2"
          >
            <Input placeholder="Enter title" size="large" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select a type" }]}
          >
            <Select placeholder="Select type" size="large">
              <Option value="MOVIE">🎬 Movie</Option>
              <Option value="TV_SHOW">📺 TV Show</Option>
            </Select>
          </Form.Item>

          <Form.Item name="director" label="Director">
            <Input placeholder="Enter director name" size="large" />
          </Form.Item>

          <Form.Item name="budget" label="Budget">
            <InputNumber
              placeholder="Enter budget"
              size="large"
              min={0}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
            />
          </Form.Item>

          <Form.Item name="duration" label="Duration (minutes)">
            <InputNumber placeholder="Enter duration" size="large" min={0} />
          </Form.Item>

          <Form.Item name="location" label="Location" className="col-span-2">
            <Input placeholder="Enter location(s)" size="large" />
          </Form.Item>

          <Form.Item
            name="yearTime"
            label="Year or Time Range"
            className="col-span-2"
          >
            <Input placeholder="e.g., 1994 or 2008-2013" size="large" />
          </Form.Item>

          <Form.Item name="posterUrl" label="Poster URL" className="col-span-2">
            <Input placeholder="Enter poster URL" size="large" />
          </Form.Item>

          <Form.Item name="notes" label="Notes" className="col-span-2">
            <TextArea rows={4} placeholder="Enter notes" size="large" />
          </Form.Item>
        </div>

        <Form.Item className="mb-0 mt-6">
          <div className="flex gap-3 justify-end">
            <Button onClick={handleCancel} size="large">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" size="large">
              {initial ? "Update Entry" : "Create Entry"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
