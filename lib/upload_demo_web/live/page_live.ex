defmodule UploadDemoWeb.PageLive do
  use UploadDemoWeb, :live_view

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <div id="upload-demo" phx-hook="Upload" phx-update="ignore"></div>

      <form class="hidden" id="upload-form" phx-change="validate_upload">
        <.live_file_input upload={@uploads.image} />
      </form>
    </div>
    """
  end

  @impl true
  def mount(_params, _session, socket) do
    socket =
      socket
      |> allow_upload(:image,
        accept: ~w(image/jpeg image/png image/gif),
        max_entries: 1,
        max_file_size: 20_000_000,
        auto_upload: true,
        progress: &handle_upload_progress/3
      )

    {:ok, socket}
  end

  @impl true
  def handle_event("validate_upload", _params, socket) do
    errors =
      for entry <- socket.assigns.uploads.image.entries,
          err <- upload_errors(socket.assigns.uploads.image, entry),
          do: error_to_string(err)

    case errors do
      [] ->
        {:noreply, socket}

      errors ->
        socket = put_flash(socket, :error, Enum.join(errors, ", "))
        {:noreply, socket}
    end
  end

  defp handle_upload_progress(_name, entry, socket) do
    if entry.done? do
      path =
        consume_uploaded_entry(socket, entry, fn %{path: path} ->
          dest = Path.join("priv/static/uploads", Path.basename(path))
          File.cp!(path, dest)
          {:ok, static_path(socket, "/uploads/#{Path.basename(dest)}")}
        end)

      if path do
        socket =
          socket
          |> put_flash(:info, "Image uploaded.")
          |> push_event("Upload:complete", %{
            url: path
          })

        {:noreply, socket}
      else
        socket =
          put_flash(socket, :error, "Error uploading image.")
          |> push_event("Upload:failed", %{})

        {:noreply, socket}
      end
    else
      socket =
        push_event(socket, "Upload:progress", %{
          progress: entry.progress
        })

      {:noreply, socket}
    end
  end

  def error_to_string(:too_large), do: "Too large"
  def error_to_string(:not_accepted), do: "You have selected an unacceptable file type"
end
